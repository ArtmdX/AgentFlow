import cron from 'node-cron';
import { emailQueueJob } from './emailQueue';
import { alertsJob } from './alerts';
import { cleanupJob } from './cleanup';

let cronJobsInitialized = false;

/**
 * Initialize all cron jobs
 * Call this once when the application starts
 */
export function initializeCronJobs() {
  // Prevent multiple initialization
  if (cronJobsInitialized) {
    console.log('[Cron] Jobs already initialized, skipping...');
    return;
  }

  console.log('[Cron] Initializing cron jobs...');

  // Email queue processor - every minute
  cron.schedule('* * * * *', async () => {
    await emailQueueJob();
  });
  console.log('[Cron] ✓ Email queue processor scheduled (every minute)');

  // Daily alerts - every day at 8 AM
  cron.schedule('0 8 * * *', async () => {
    await alertsJob();
  });
  console.log('[Cron] ✓ Daily alerts scheduled (8:00 AM)');

  // Daily cleanup - every day at 2 AM
  cron.schedule('0 2 * * *', async () => {
    await cleanupJob();
  });
  console.log('[Cron] ✓ Daily cleanup scheduled (2:00 AM)');

  cronJobsInitialized = true;
  console.log('[Cron] All cron jobs initialized successfully');
}

/**
 * Check if cron jobs are initialized
 */
export function areCronJobsInitialized(): boolean {
  return cronJobsInitialized;
}
