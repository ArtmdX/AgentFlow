/**
 * API Route: /api/settings/logo
 * Upload agency logo
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { hasPermission, Permission } from '@/lib/permissions';

/**
 * POST /api/settings/logo
 * Upload logo as base64
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

    // Check permission
    if (!hasPermission(session as any, Permission.MANAGE_SETTINGS)) {
      return NextResponse.json(
        { error: 'Sem permissão para gerenciar configurações' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { file } = body;

    if (!file) {
      return NextResponse.json(
        { error: 'Arquivo não fornecido' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
    const fileType = file.split(';')[0].split(':')[1];

    if (!validTypes.includes(fileType)) {
      return NextResponse.json(
        { error: 'Tipo de arquivo inválido. Apenas PNG, JPG e SVG são permitidos.' },
        { status: 400 }
      );
    }

    // Validate file size (2MB max)
    const base64Data = file.split(',')[1];
    const sizeInBytes = (base64Data.length * 3) / 4;
    const sizeInMB = sizeInBytes / (1024 * 1024);

    if (sizeInMB > 2) {
      return NextResponse.json(
        { error: 'Arquivo muito grande. Tamanho máximo: 2MB' },
        { status: 400 }
      );
    }

    // Return the base64 data URL
    return NextResponse.json(
      {
        message: 'Logo carregado com sucesso',
        logoUrl: file,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('POST /api/settings/logo error:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao fazer upload do logo' },
      { status: 500 }
    );
  }
}
