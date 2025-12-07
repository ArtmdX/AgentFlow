/**
 * API Route: /api/settings
 * Manages agency settings
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { hasPermission, Permission } from '@/lib/permissions';
import { getSettings, updateSettings } from '@/services/settingsService';
import { agencySettingsSchema } from '@/lib/validations';

/**
 * GET /api/settings
 * Get agency settings
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

    // Check permission
    if (!hasPermission(session as any, Permission.VIEW_SETTINGS)) {
      return NextResponse.json(
        { error: 'Sem permissão para visualizar configurações' },
        { status: 403 }
      );
    }

    const settings = await getSettings();

    return NextResponse.json(settings, { status: 200 });
  } catch (error: any) {
    console.error('GET /api/settings error:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar configurações' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/settings
 * Update agency settings
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Check permission - only admin can update settings
    if (!hasPermission(session as any, Permission.MANAGE_SETTINGS)) {
      return NextResponse.json(
        { error: 'Sem permissão para gerenciar configurações' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate data
    const validatedData = agencySettingsSchema.parse(body);

    // Update settings
    const settings = await updateSettings(validatedData);

    return NextResponse.json(
      {
        message: 'Configurações atualizadas com sucesso',
        data: settings,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('PUT /api/settings error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Erro ao atualizar configurações' },
      { status: 500 }
    );
  }
}
