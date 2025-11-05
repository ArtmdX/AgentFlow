// GET e PUT do perfil do usuário logado

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { handleAPIError } from '@/lib/error-handler';
import { AuthenticationError } from '@/lib/errors';
import { updateProfileSchema } from '@/lib/validations/user';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      throw new AuthenticationError('Você precisa estar autenticado');
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
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
      throw new AuthenticationError('Usuário não encontrado');
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      throw new AuthenticationError('Você precisa estar autenticado');
    }

    const body = await request.json();

    // Validação com Zod
    const validatedData = updateProfileSchema.parse(body);

    // Atualizar perfil (sem permitir alterar email, role ou isActive)
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(validatedData.firstName && { firstName: validatedData.firstName }),
        ...(validatedData.lastName && { lastName: validatedData.lastName }),
        ...(validatedData.phone !== undefined && { phone: validatedData.phone })
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
