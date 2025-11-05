// GET e POST de usuários (admin/manager only)

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import bcrypt from 'bcryptjs';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { handleAPIError } from '@/lib/error-handler';
import { AuthenticationError, AuthorizationError } from '@/lib/errors';
import { createUserSchema } from '@/lib/validations/user';
import { hasPermission } from '@/lib/permissions';
import type { Session } from 'next-auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions) as Session | null;

    if (!session || !session.user?.id) {
      throw new AuthenticationError('Você precisa estar autenticado para acessar esta página');
    }

    // Verificar permissão para gerenciar usuários
    if (!hasPermission(session, 'manage_users')) {
      throw new AuthorizationError('Você não tem permissão para gerenciar usuários');
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        // Não retornar password hash
        passwordHash: false
      }
    });

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions) as Session | null;

    if (!session || !session.user?.id) {
      throw new AuthenticationError('Você precisa estar autenticado para criar um usuário');
    }

    // Verificar permissão para criar usuários
    if (!hasPermission(session, 'create_user')) {
      throw new AuthorizationError('Você não tem permissão para criar usuários');
    }

    const body = await request.json();

    // Validação com Zod
    const validatedData = createUserSchema.parse(body);

    // Verificar se o email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Já existe um usuário com este email' },
        { status: 409 }
      );
    }

    // Hash da senha
    const passwordHash = await bcrypt.hash(validatedData.password, 10);

    // Criar o usuário
    const newUser = await prisma.user.create({
      data: {
        email: validatedData.email,
        passwordHash,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        phone: validatedData.phone || null,
        role: validatedData.role,
        isActive: validatedData.isActive
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

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return handleAPIError(error);
  }
}
