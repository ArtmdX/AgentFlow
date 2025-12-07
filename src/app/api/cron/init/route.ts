import { initializeCronJobs } from '@/lib/cron';
import { NextResponse } from 'next/server';

/**
 * POST /api/cron/init
 * Initialize cron jobs (called once on app startup)
 */
export async function POST() {
  try {
    initializeCronJobs();

    return NextResponse.json({
      success: true,
      message: 'Cron jobs initialized successfully',
    });
  } catch (error) {
    console.error('Error initializing cron jobs:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to initialize cron jobs',
      },
      { status: 500 }
    );
  }
}
