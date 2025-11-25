// POST para solicitar recuperação de senha

import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { handleAPIError } from "@/lib/error-handler";
import { forgotPasswordSchema } from "@/lib/validations/user";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validação com Zod
    const validatedData = forgotPasswordSchema.parse(body);

    // Buscar usuário pelo email
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    // Por segurança, sempre retornar sucesso mesmo se o usuário não existir
    // Isso previne enumeration attacks
    if (!user) {
      return NextResponse.json(
        {
          message: "Se o email existir em nosso sistema, você receberá um link de recuperação",
        },
        { status: 200 }
      );
    }

    // Verificar se o usuário está ativo
    if (!user.isActive) {
      return NextResponse.json(
        {
          message: "Se o email existir em nosso sistema, você receberá um link de recuperação",
        },
        { status: 200 }
      );
    }

    // Gerar token seguro
    const token = crypto.randomBytes(32).toString("hex");

    // Token expira em 1 hora
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    // Invalidar tokens anteriores do usuário (soft delete - apenas marcar como usados)
    await prisma.passwordResetToken.updateMany({
      where: {
        userId: user.id,
        usedAt: null,
        expiresAt: { gte: new Date() },
      },
      data: {
        usedAt: new Date(),
      },
    });

    // Criar novo token
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    // Enviar email de recuperação de senha
    try {
      await sendPasswordResetEmail({
        to: user.email,
        userName: user.firstName || user.email,
        resetToken: token,
      });

      // Em desenvolvimento, também logar no console para facilitar testes
      if (process.env.NODE_ENV === "development") {
        console.log("\n========================================");
        console.log("📧 EMAIL DE RECUPERAÇÃO ENVIADO");
        console.log("========================================");
        console.log(`Para: ${user.email}`);
        console.log(`Token: ${token}`);
        console.log(`Link: ${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`);
        console.log(`Expira em: ${expiresAt.toLocaleString("pt-BR")}`);
        console.log("========================================\n");
      }
    } catch (emailError) {
      // Log do erro mas não expor ao usuário por segurança
      console.error("Erro ao enviar email de recuperação:", emailError);
      // Continuar mesmo se o email falhar (por segurança, não revelar se o email existe)
    }

    return NextResponse.json(
      {
        message: "Se o email existir em nosso sistema, você receberá um link de recuperação",
      },
      { status: 200 }
    );
  } catch (error) {
    return handleAPIError(error);
  }
}
