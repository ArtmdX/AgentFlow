// POST para redefinir senha com token

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { handleAPIError } from '@/lib/error-handler';
import { ValidationError } from '@/lib/errors';
import { resetPasswordSchema } from '@/lib/validations/user';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validação com Zod
    const validatedData = resetPasswordSchema.parse(body);

    // Buscar token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token: validatedData.token },
      include: { user: true }
    });

    // Verificar se o token existe
    if (!resetToken) {
      throw new ValidationError('Token inválido ou expirado');
    }

    // Verificar se o token já foi usado
    if (resetToken.usedAt) {
      throw new ValidationError('Este token já foi utilizado');
    }

    // Verificar se o token está expirado
    if (new Date() > resetToken.expiresAt) {
      throw new ValidationError('Token expirado. Solicite uma nova recuperação de senha');
    }

    // Verificar se o usuário está ativo
    if (!resetToken.user.isActive) {
      throw new ValidationError('Usuário inativo');
    }

    // Hash da nova senha
    const passwordHash = await bcrypt.hash(validatedData.password, 10);

    // Atualizar senha do usuário
    await prisma.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash }
    });

    // Marcar token como usado
    await prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() }
    });

    return NextResponse.json({
      message: 'Senha redefinida com sucesso! Você já pode fazer login com sua nova senha.'
    }, { status: 200 });
  } catch (error) {
    return handleAPIError(error);
  }
}
