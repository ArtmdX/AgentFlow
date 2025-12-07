/**
 * API Route: /api/settings/test-smtp
 * Test SMTP connection
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { hasPermission, Permission } from '@/lib/permissions';
import { testSmtpConnection } from '@/services/settingsService';
import { smtpTestSchema } from '@/lib/validations';

/**
 * POST /api/settings/test-smtp
 * Test SMTP connection and send test email
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

    // Validate data
    const validatedData = smtpTestSchema.parse(body);

    // Test SMTP connection
    const result = await testSmtpConnection(validatedData);

    return NextResponse.json(result, {
      status: result.success ? 200 : 400
    });
  } catch (error: any) {
    console.error('POST /api/settings/test-smtp error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          error: 'Dados inválidos',
          details: error.errors
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erro ao testar conexão SMTP'
      },
      { status: 500 }
    );
  }
}
