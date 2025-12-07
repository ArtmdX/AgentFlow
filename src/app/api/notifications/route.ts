import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  getNotificationsForUser,
  createNotification,
} from '@/services/notificationService';
import { CreateNotificationInput } from '@/types/notification';

/**
 * GET /api/notifications
 * List notifications for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    // Get notifications
    const result = await getNotificationsForUser(session.user.id, {
      page,
      limit: Math.min(limit, 100), // Max 100 per page
      unreadOnly,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/notifications
 * Create a new notification (admin/system use)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can create notifications manually
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const input: CreateNotificationInput = {
      type: body.type,
      priority: body.priority,
      title: body.title,
      message: body.message,
      actionUrl: body.actionUrl,
      userId: body.userId,
      relatedEntity: body.relatedEntity,
      relatedEntityId: body.relatedEntityId,
    };

    const notification = await createNotification(input);

    return NextResponse.json(notification, { status: 201 });
  } catch (error: any) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}
