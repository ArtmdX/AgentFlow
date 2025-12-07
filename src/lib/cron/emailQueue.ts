import { processEmailQueue } from '@/services/emailQueueService';

/**
 * Cron job: Process email queue every minute
 * Processes pending emails with retry logic
 */
export async function emailQueueJob() {
  try {
    const processedCount = await processEmailQueue();

    if (processedCount > 0) {
      console.log(`[Cron:EmailQueue] Processed ${processedCount} emails`);
    }
  } catch (error) {
    console.error('[Cron:EmailQueue] Error processing email queue:', error);
  }
}
