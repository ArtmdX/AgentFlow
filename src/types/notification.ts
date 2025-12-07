import { Notification, NotificationPreference, NotificationType, NotificationPriority } from '@prisma/client';

// ========================================
// Notification Types
// ========================================

export type { Notification, NotificationPreference, NotificationType, NotificationPriority };

export interface CreateNotificationInput {
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  actionUrl?: string;
  userId: string;
  relatedEntity?: string;
  relatedEntityId?: string;
}

export interface UpdateNotificationInput {
  isRead?: boolean;
  readAt?: Date | null;
}

export interface NotificationWithUser extends Notification {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface NotificationListResponse {
  notifications: Notification[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface NotificationPreferenceUpdate {
  // In-app notifications
  inAppEnabled?: boolean;
  travelCreated?: boolean;
  travelStatusChanged?: boolean;
  paymentReceived?: boolean;
  travelUpcoming?: boolean;
  paymentDueSoon?: boolean;
  paymentOverdue?: boolean;
  documentsPending?: boolean;

  // Email notifications
  emailEnabled?: boolean;
  emailTravelCreated?: boolean;
  emailPaymentReceived?: boolean;
  emailTravelUpcoming?: boolean;
  emailPaymentDueSoon?: boolean;
  emailPaymentOverdue?: boolean;
  emailDocumentsPending?: boolean;

  // Digest mode
  digestMode?: boolean;
  digestTime?: string;
}

// ========================================
// SSE Event Types
// ========================================

export type SSEEvent =
  | { event: 'connected' }
  | { event: 'heartbeat' }
  | { event: 'notification'; data: Notification }
  | { event: 'close' };

export interface SSEMessage {
  event: string;
  data?: any;
}
