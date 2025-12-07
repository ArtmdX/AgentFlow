import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { hasPermission, Permission } from '@/lib/permissions';
import type { SessionWithRole } from '@/lib/permissions';

/**
 * GET /api/emails/stats
 * Get email sending statistics (admin only)
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permission
    if (!hasPermission(session as SessionWithRole, Permission.VIEW_EMAIL_LOGS)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const now = new Date();

    // Calculate date ranges
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Fetch statistics for different time periods
    const [
      stats24h,
      stats7days,
      stats30days,
      statsByTemplate,
      totalEmails,
      successfulEmails,
    ] = await Promise.all([
      // Last 24 hours
      prisma.emailLog.groupBy({
        by: ['status'],
        _count: true,
        where: { createdAt: { gte: last24h } },
      }),

      // Last 7 days
      prisma.emailLog.groupBy({
        by: ['status'],
        _count: true,
        where: { createdAt: { gte: last7days } },
      }),

      // Last 30 days
      prisma.emailLog.groupBy({
        by: ['status'],
        _count: true,
        where: { createdAt: { gte: last30days } },
      }),

      // By template type
      prisma.emailLog.groupBy({
        by: ['templateType'],
        _count: true,
        orderBy: { _count: { templateType: 'desc' } },
      }),

      // Total emails
      prisma.emailLog.count(),

      // Successful emails
      prisma.emailLog.count({ where: { status: 'sent' } }),
    ]);

    // Helper to format stats
    const formatStats = (stats: any[]) => ({
      sent: stats.find((s) => s.status === 'sent')?._count || 0,
      failed: stats.find((s) => s.status === 'failed')?._count || 0,
      pending: stats.find((s) => s.status === 'pending')?._count || 0,
      cancelled: stats.find((s) => s.status === 'cancelled')?._count || 0,
    });

    // Calculate delivery rate
    const deliveryRate = totalEmails > 0
      ? ((successfulEmails / totalEmails) * 100).toFixed(2)
      : '0.00';

    // Format template stats
    const byTemplate = statsByTemplate.reduce((acc: any, item: any) => {
      acc[item.templateType] = item._count;
      return acc;
    }, {});

    return NextResponse.json({
      last24h: formatStats(stats24h),
      last7days: formatStats(stats7days),
      last30days: formatStats(stats30days),
      byTemplate,
      deliveryRate: parseFloat(deliveryRate),
      total: totalEmails,
      successful: successfulEmails,
    });
  } catch (error) {
    console.error('Error fetching email stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email statistics' },
      { status: 500 }
    );
  }
}
