// GET, PUT e DELETE de usuário específico

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { handleAPIError } from '@/lib/error-handler';
import { AuthenticationError, AuthorizationError, NotFoundError } from '@/lib/errors';
import { updateUserSchema } from '@/lib/validations/user';
import { hasPermission, Permission, type SessionWithRole } from '@/lib/permissions';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions) as SessionWithRole | null;

    if (!session || !session.user?.id) {
      throw new AuthenticationError('Você precisa estar autenticado');
    }

    // Permitir que usuário veja seus próprios dados ou admin/manager vejam qualquer usuário
    const { id } = await params;
    const isOwnProfile = session.user.id === id;

    if (!isOwnProfile && !hasPermission(session, Permission.VIEW_USERS)) {
      throw new AuthorizationError('Você não tem permissão para ver dados de outros usuários');
    }

    const user = await prisma.user.findUnique({
      where: { id },
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

    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions) as SessionWithRole | null;

    if (!session || !session.user?.id) {
      throw new AuthenticationError('Você precisa estar autenticado');
    }

    const { id } = await params;

    // Verificar permissão para editar usuários
    if (!hasPermission(session, Permission.UPDATE_USER)) {
      throw new AuthorizationError('Você não tem permissão para editar usuários');
    }

    const body = await request.json();

    // Validação com Zod
    const validatedData = updateUserSchema.parse(body);

    // Verificar se o usuário existe
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      throw new NotFoundError('Usuário não encontrado');
    }

    // Se está alterando email, verificar se não existe outro usuário com esse email
    if (validatedData.email && validatedData.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: validatedData.email }
      });

      if (emailExists) {
        return NextResponse.json(
          { error: 'Já existe um usuário com este email' },
          { status: 409 }
        );
      }
    }

    // Atualizar o usuário
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(validatedData.email && { email: validatedData.email }),
        ...(validatedData.firstName && { firstName: validatedData.firstName }),
        ...(validatedData.lastName && { lastName: validatedData.lastName }),
        ...(validatedData.phone !== undefined && { phone: validatedData.phone }),
        ...(validatedData.role && { role: validatedData.role }),
        ...(validatedData.isActive !== undefined && { isActive: validatedData.isActive })
      },
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

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions) as SessionWithRole | null;

    if (!session || !session.user?.id) {
      throw new AuthenticationError('Você precisa estar autenticado');
    }

    const { id } = await params;

    // Apenas admin pode deletar usuários
    if (!hasPermission(session, Permission.DELETE_USER)) {
      throw new AuthorizationError('Você não tem permissão para deletar usuários');
    }

    // Não permitir deletar a si mesmo
    if (session.user.id === id) {
      return NextResponse.json(
        { error: 'Você não pode deletar sua própria conta' },
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

    // Soft delete - apenas desativar o usuário
    await prisma.user.update({
      where: { id },
      data: { isActive: false }
    });

    return NextResponse.json(
      { message: 'Usuário desativado com sucesso' },
      { status: 200 }
    );
  } catch (error) {
    return handleAPIError(error);
  }
}
