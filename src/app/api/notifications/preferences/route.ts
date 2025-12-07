import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  getOrCreateNotificationPreferences,
  updateNotificationPreferences,
} from '@/services/notificationService';
import { NotificationPreferenceUpdate } from '@/types/notification';

/**
 * GET /api/notifications/preferences
 * Get notification preferences for the authenticated user
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const preferences = await getOrCreateNotificationPreferences(session.user.id);

    return NextResponse.json(preferences);
  } catch (error: any) {
    console.error('Error fetching notification preferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notification preferences' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/notifications/preferences
 * Update notification preferences for the authenticated user
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const updates: NotificationPreferenceUpdate = body;

    // Ensure user preferences exist first
    await getOrCreateNotificationPreferences(session.user.id);

    // Update preferences
    const preferences = await updateNotificationPreferences(
      session.user.id,
      updates
    );

    return NextResponse.json(preferences);
  } catch (error: any) {
    console.error('Error updating notification preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update notification preferences' },
      { status: 500 }
    );
  }
}
