import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { hasPermission, Permission } from '@/lib/permissions';
import type { SessionWithRole } from '@/lib/permissions';

/**
 * GET /api/emails/logs
 * List email logs with filtering (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permission
    if (!hasPermission(session as SessionWithRole, Permission.VIEW_EMAIL_LOGS)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const status = searchParams.get('status') as 'pending' | 'sent' | 'failed' | 'cancelled' | null;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const templateType = searchParams.get('templateType');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    if (templateType) {
      where.templateType = templateType;
    }

    // Fetch logs and count
    const [logs, total] = await Promise.all([
      prisma.emailLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.emailLog.count({ where }),
    ]);

    // Get statistics
    const stats = await prisma.emailLog.groupBy({
      by: ['status'],
      _count: true,
      where,
    });

    const statsMap = {
      total,
      sent: stats.find((s) => s.status === 'sent')?._count || 0,
      failed: stats.find((s) => s.status === 'failed')?._count || 0,
      pending: stats.find((s) => s.status === 'pending')?._count || 0,
      cancelled: stats.find((s) => s.status === 'cancelled')?._count || 0,
    };

    return NextResponse.json({
      logs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      stats: statsMap,
    });
  } catch (error) {
    console.error('Error fetching email logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email logs' },
      { status: 500 }
    );
  }
}
