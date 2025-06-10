import prisma from '@/lib/prisma';
import { registerSchema } from '@/lib/validations';
import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { z } from 'zod';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { firstName, lastName, email, password, phone } = registerSchema.parse(body);

    // Verifica se já existe um usuário com este email
    const userExists = await prisma.user.findUnique({
      where: { email }
    });

    if (userExists) {
      return NextResponse.json({ message: 'Email já cadastrado' }, { status: 400 });
    }

    // Cria hash da senha
    const hashedPassword = await hash(password, 10);

    // Cria o usuário
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash: hashedPassword,
        phone,
        role: 'agent'
      }
    });

    return NextResponse.json(
      {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        }
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Dados inválidos', errors: error.errors }, { status: 400 });
    }

    return NextResponse.json({ message: 'Erro ao criar usuário' }, { status: 500 });
  }
}
