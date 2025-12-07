'use client';

import { useEffect } from 'react';

/**
 * CronInitializer Component
 * Initializes cron jobs on app startup by calling the init API
 * Should be included once in the root layout
 */
export function CronInitializer() {
  useEffect(() => {
    // Initialize cron jobs on mount
    fetch('/api/cron/init', { method: 'POST' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log('[CronInitializer] Cron jobs initialized');
        } else {
          console.error('[CronInitializer] Failed to initialize cron jobs:', data.error);
        }
      })
      .catch((error) => {
        console.error('[CronInitializer] Error calling cron init API:', error);
      });
  }, []);

  return null; // This component doesn't render anything
}
