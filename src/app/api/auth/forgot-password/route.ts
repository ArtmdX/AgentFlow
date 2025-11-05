// POST para solicitar recuperação de senha

import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { handleAPIError } from '@/lib/error-handler';
import { forgotPasswordSchema } from '@/lib/validations/user';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validação com Zod
    const validatedData = forgotPasswordSchema.parse(body);

    // Buscar usuário pelo email
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    // Por segurança, sempre retornar sucesso mesmo se o usuário não existir
    // Isso previne enumeration attacks
    if (!user) {
      return NextResponse.json({
        message: 'Se o email existir em nosso sistema, você receberá um link de recuperação'
      }, { status: 200 });
    }

    // Verificar se o usuário está ativo
    if (!user.isActive) {
      return NextResponse.json({
        message: 'Se o email existir em nosso sistema, você receberá um link de recuperação'
      }, { status: 200 });
    }

    // Gerar token seguro
    const token = crypto.randomBytes(32).toString('hex');

    // Token expira em 1 hora
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    // Invalidar tokens anteriores do usuário (soft delete - apenas marcar como usados)
    await prisma.passwordResetToken.updateMany({
      where: {
        userId: user.id,
        usedAt: null,
        expiresAt: { gte: new Date() }
      },
      data: {
        usedAt: new Date()
      }
    });

    // Criar novo token
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt
      }
    });

    // TODO: Enviar email com o link de reset
    // Por enquanto, em desenvolvimento, vamos apenas logar o token no console
    if (process.env.NODE_ENV === 'development') {
      console.log('\n========================================');
      console.log('🔑 TOKEN DE RECUPERAÇÃO DE SENHA');
      console.log('========================================');
      console.log(`Email: ${user.email}`);
      console.log(`Token: ${token}`);
      console.log(`Link: ${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`);
      console.log(`Expira em: ${expiresAt.toLocaleString('pt-BR')}`);
      console.log('========================================\n');
    }

    // Em produção, você deve integrar com um serviço de email como:
    // - Resend (https://resend.com)
    // - SendGrid
    // - AWS SES
    // - Nodemailer com SMTP

    /* Exemplo com Resend:
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'AgentFlow <noreply@agentflow.com>',
      to: user.email,
      subject: 'Recuperação de Senha - AgentFlow',
      html: `
        <h1>Recuperação de Senha</h1>
        <p>Olá ${user.firstName},</p>
        <p>Você solicitou a recuperação de senha. Clique no link abaixo para criar uma nova senha:</p>
        <a href="${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}">
          Redefinir Senha
        </a>
        <p>Este link expira em 1 hora.</p>
        <p>Se você não solicitou esta recuperação, ignore este email.</p>
      `
    });
    */

    return NextResponse.json({
      message: 'Se o email existir em nosso sistema, você receberá um link de recuperação'
    }, { status: 200 });
  } catch (error) {
    return handleAPIError(error);
  }
}
