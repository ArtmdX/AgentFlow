// PATCH para ativar/desativar usuário

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { handleAPIError } from '@/lib/error-handler';
import { AuthenticationError, AuthorizationError, NotFoundError } from '@/lib/errors';
import { hasPermission, Permission, type SessionWithRole } from '@/lib/permissions';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions) as SessionWithRole | null;

    if (!session || !session.user?.id) {
      throw new AuthenticationError('Você precisa estar autenticado');
    }

    const { id } = await params;

    // Verificar permissão
    if (!hasPermission(session, Permission.UPDATE_USER)) {
      throw new AuthorizationError('Você não tem permissão para ativar/desativar usuários');
    }

    // Não permitir desativar a si mesmo
    if (session.user.id === id) {
      return NextResponse.json(
        { error: 'Você não pode desativar sua própria conta' },
        { status: 400 }
      );
    }

    // Verificar se o usuário existe
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      throw new NotFoundError('Usuário não encontrado');
    }

    // Toggle isActive
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isActive: !existingUser.isActive },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json({
      user: updatedUser,
      message: updatedUser.isActive ? 'Usuário ativado com sucesso' : 'Usuário desativado com sucesso'
    }, { status: 200 });
  } catch (error) {
    return handleAPIError(error);
  }
}
