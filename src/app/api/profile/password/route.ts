// PATCH para alterar senha do usuário logado

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import bcrypt from 'bcryptjs';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { handleAPIError } from '@/lib/error-handler';
import { AuthenticationError, ValidationError } from '@/lib/errors';
import { changePasswordSchema } from '@/lib/validations/user';

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      throw new AuthenticationError('Você precisa estar autenticado');
    }

    const body = await request.json();

    // Validação com Zod
    const validatedData = changePasswordSchema.parse(body);

    // Buscar usuário atual com senha
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        passwordHash: true
      }
    });

    if (!user) {
      throw new AuthenticationError('Usuário não encontrado');
    }

    // Verificar se a senha atual está correta
    const isPasswordValid = await bcrypt.compare(
      validatedData.currentPassword,
      user.passwordHash
    );

    if (!isPasswordValid) {
      throw new ValidationError('Senha atual incorreta');
    }

    // Hash da nova senha
    const newPasswordHash = await bcrypt.hash(validatedData.newPassword, 10);

    // Atualizar senha
    await prisma.user.update({
      where: { id: session.user.id },
      data: { passwordHash: newPasswordHash }
    });

    return NextResponse.json({
      message: 'Senha alterada com sucesso'
    }, { status: 200 });
  } catch (error) {
    return handleAPIError(error);
  }
}
