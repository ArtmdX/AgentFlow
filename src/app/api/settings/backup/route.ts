/**
 * API Route: /api/settings/backup
 * Export and import settings backup
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { hasPermission, Permission } from '@/lib/permissions';
import { exportBackup, importBackup } from '@/services/settingsService';

/**
 * GET /api/settings/backup
 * Export settings backup as JSON
 */
export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Check permission - only admin
    if (!hasPermission(session as any, Permission.MANAGE_SETTINGS)) {
      return NextResponse.json(
        { error: 'Sem permissão para exportar backup' },
        { status: 403 }
      );
    }

    const backup = await exportBackup();

    // Return JSON file download
    return new NextResponse(JSON.stringify(backup, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="agentflow-settings-backup-${new Date().toISOString().split('T')[0]}.json"`,
      },
    });
  } catch (error: any) {
    console.error('GET /api/settings/backup error:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao exportar backup' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/settings/backup
 * Import settings from backup JSON
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Check permission - only admin
    if (!hasPermission(session as any, Permission.MANAGE_SETTINGS)) {
      return NextResponse.json(
        { error: 'Sem permissão para importar backup' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Import backup
    const result = await importBackup(body);

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('POST /api/settings/backup error:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao importar backup' },
      { status: 500 }
    );
  }
}
