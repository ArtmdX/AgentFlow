import prisma from '@/lib/prisma';
import {
  CreateNotificationInput,
  NotificationPreferenceUpdate,
} from '@/types/notification';
import { Notification, NotificationPreference } from '@prisma/client';
import { queueEmail as queueEmailService } from './emailService';

// Re-export queueEmail for convenience
export { queueEmailService as queueEmail };

// ========================================
// Notification CRUD Operations
// ========================================

/**
 * Create a new notification
 */
export async function createNotification(
  input: CreateNotificationInput
): Promise<Notification> {
  // Check user preferences before creating
  const preferences = await getOrCreateNotificationPreferences(input.userId);

  // Check if in-app notifications are enabled for this user
  if (!preferences.inAppEnabled) {
    // If notifications are disabled, still create but mark as read
    const notification = await prisma.notification.create({
      data: {
        ...input,
        isRead: true,
        readAt: new Date(),
      },
    });
    return notification;
  }

  // Check specific event preferences
  const eventType = getEventTypeFromNotification(input);
  if (eventType && !isEventEnabled(preferences, eventType, 'inApp')) {
    // Event disabled, create but mark as read
    const notification = await prisma.notification.create({
      data: {
        ...input,
        isRead: true,
        readAt: new Date(),
      },
    });
    return notification;
  }

  // Create notification
  const notification = await prisma.notification.create({
    data: input,
  });

  // Send real-time notification via SSE
  try {
    const { sendNotificationToUser } = await import('@/lib/notifications/sse');
    sendNotificationToUser(input.userId, notification);
  } catch (_error) {
    // SSE not available or user not connected, notification still created in DB
    console.log('SSE notification not sent (user may not be connected)');
  }

  return notification;
}

/**
 * Get notification by ID
 */
export async function getNotificationById(id: string): Promise<Notification | null> {
  return await prisma.notification.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });
}

/**
 * Get notifications for a user with pagination
 */
export async function getNotificationsForUser(
  userId: string,
  options: {
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
  } = {}
) {
  const { page = 1, limit = 20, unreadOnly = false } = options;
  const skip = (page - 1) * limit;

  const where = {
    userId,
    ...(unreadOnly && { isRead: false }),
  };

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.notification.count({ where }),
  ]);

  return {
    notifications,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get unread notification count for a user
 */
export async function getUnreadCount(userId: string): Promise<number> {
  return await prisma.notification.count({
    where: {
      userId,
      isRead: false,
    },
  });
}

/**
 * Mark notification as read
 */
export async function markAsRead(id: string): Promise<Notification> {
  return await prisma.notification.update({
    where: { id },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllAsRead(userId: string): Promise<number> {
  const result = await prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
    },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });

  return result.count;
}

/**
 * Delete a notification
 */
export async function deleteNotification(id: string): Promise<void> {
  await prisma.notification.delete({
    where: { id },
  });
}

/**
 * Delete all read notifications for a user
 */
export async function clearAllRead(userId: string): Promise<number> {
  const result = await prisma.notification.deleteMany({
    where: {
      userId,
      isRead: true,
    },
  });

  return result.count;
}

// ========================================
// Notification Preferences
// ========================================

/**
 * Get or create notification preferences for a user
 */
export async function getOrCreateNotificationPreferences(
  userId: string
): Promise<NotificationPreference> {
  let preferences = await prisma.notificationPreference.findUnique({
    where: { userId },
  });

  if (!preferences) {
    preferences = await prisma.notificationPreference.create({
      data: {
        userId,
      },
    });
  }

  return preferences;
}

/**
 * Update notification preferences
 */
export async function updateNotificationPreferences(
  userId: string,
  updates: NotificationPreferenceUpdate
): Promise<NotificationPreference> {
  return await prisma.notificationPreference.update({
    where: { userId },
    data: updates,
  });
}

// ========================================
// Helper Functions
// ========================================

type EventType =
  | 'travel_created'
  | 'travel_status_changed'
  | 'payment_received'
  | 'travel_upcoming'
  | 'payment_due_soon'
  | 'payment_overdue'
  | 'documents_pending';

/**
 * Determine event type from notification input
 */
function getEventTypeFromNotification(input: CreateNotificationInput): EventType | null {
  const { relatedEntity, title, message } = input;

  if (relatedEntity === 'travel') {
    if (title.includes('criada') || message.includes('criada')) {
      return 'travel_created';
    }
    if (title.includes('status') || title.includes('Status')) {
      return 'travel_status_changed';
    }
    if (title.includes('próxima') || message.includes('próxima')) {
      return 'travel_upcoming';
    }
  }

  if (relatedEntity === 'payment') {
    if (title.includes('recebido') || message.includes('recebido')) {
      return 'payment_received';
    }
    if (title.includes('vencendo') || message.includes('vencendo')) {
      return 'payment_due_soon';
    }
    if (title.includes('atrasado') || message.includes('atrasado')) {
      return 'payment_overdue';
    }
  }

  if (title.includes('documentos') || title.includes('Documentos')) {
    return 'documents_pending';
  }

  return null;
}

/**
 * Check if event is enabled in preferences
 */
function isEventEnabled(
  preferences: NotificationPreference,
  eventType: EventType,
  channel: 'inApp' | 'email'
): boolean {
  const eventMap: Record<EventType, { inApp: keyof NotificationPreference; email: keyof NotificationPreference }> = {
    travel_created: {
      inApp: 'travelCreated',
      email: 'emailTravelCreated',
    },
    travel_status_changed: {
      inApp: 'travelStatusChanged',
      email: 'emailTravelCreated', // Use same as created for now
    },
    payment_received: {
      inApp: 'paymentReceived',
      email: 'emailPaymentReceived',
    },
    travel_upcoming: {
      inApp: 'travelUpcoming',
      email: 'emailTravelUpcoming',
    },
    payment_due_soon: {
      inApp: 'paymentDueSoon',
      email: 'emailPaymentDueSoon',
    },
    payment_overdue: {
      inApp: 'paymentOverdue',
      email: 'emailPaymentOverdue',
    },
    documents_pending: {
      inApp: 'documentsPending',
      email: 'emailDocumentsPending',
    },
  };

  const preferenceKey = eventMap[eventType]?.[channel];
  if (!preferenceKey) return true; // If not mapped, allow by default

  return Boolean(preferences[preferenceKey]);
}

/**
 * Check if email should be sent for this event
 */
export async function shouldSendEmail(
  userId: string,
  eventType: EventType
): Promise<boolean> {
  const preferences = await getOrCreateNotificationPreferences(userId);

  if (!preferences.emailEnabled) {
    return false;
  }

  return isEventEnabled(preferences, eventType, 'email');
}
