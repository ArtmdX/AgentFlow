import prisma from '@/lib/prisma';
import { cleanOldQueueEntries } from '@/services/emailQueueService';

/**
 * Cron job: Daily cleanup at 2 AM
 * Cleans old notifications and email queue entries
 */
export async function cleanupJob() {
  console.log('[Cron:Cleanup] Starting daily cleanup...');

  try {
    // Clean old read notifications (older than 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const deletedNotifications = await prisma.notification.deleteMany({
      where: {
        isRead: true,
        createdAt: {
          lt: thirtyDaysAgo,
        },
      },
    });

    console.log(`[Cleanup] Deleted ${deletedNotifications.count} old notifications`);

    // Clean old email queue entries
    const deletedQueueEntries = await cleanOldQueueEntries();
    console.log(`[Cleanup] Deleted ${deletedQueueEntries} old queue entries`);

    console.log('[Cron:Cleanup] Daily cleanup completed successfully');
  } catch (error) {
    console.error('[Cron:Cleanup] Error during cleanup:', error);
  }
}
