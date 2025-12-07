import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { clearAllRead } from '@/services/notificationService';

/**
 * DELETE /api/notifications/clear-all
 * Delete all read notifications for the authenticated user
 */
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const count = await clearAllRead(session.user.id);

    return NextResponse.json({ count });
  } catch (error: any) {
    console.error('Error clearing all read notifications:', error);
    return NextResponse.json(
      { error: 'Failed to clear all read notifications' },
      { status: 500 }
    );
  }
}
