// PATCH para admin resetar senha de um usuário

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import bcrypt from 'bcryptjs';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { handleAPIError } from '@/lib/error-handler';
import { AuthenticationError, AuthorizationError, NotFoundError } from '@/lib/errors';
import { adminResetPasswordSchema } from '@/lib/validations/user';
import { hasPermission } from '@/lib/permissions';
import type { Session } from 'next-auth';

type RouteContext = {
  params: {
    id: string;
  };
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions) as Session | null;

    if (!session || !session.user?.id) {
      throw new AuthenticationError('Você precisa estar autenticado');
    }

    const { id } = context.params;

    // Verificar permissão - apenas admin pode resetar senha de outros usuários
    if (!hasPermission(session, 'reset_user_password')) {
      throw new AuthorizationError('Você não tem permissão para resetar senhas de usuários');
    }

    const body = await request.json();

    // Validação com Zod
    const validatedData = adminResetPasswordSchema.parse(body);

    // Verificar se o usuário existe
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      throw new NotFoundError('Usuário não encontrado');
    }

    // Hash da nova senha
    const passwordHash = await bcrypt.hash(validatedData.newPassword, 10);

    // Atualizar senha
    await prisma.user.update({
      where: { id },
      data: { passwordHash }
    });

    return NextResponse.json({
      message: 'Senha resetada com sucesso'
    }, { status: 200 });
  } catch (error) {
    return handleAPIError(error);
  }
}
