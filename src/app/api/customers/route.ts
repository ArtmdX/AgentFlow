// GET e POST de clientes

import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Customer } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const customers = await prisma.customer.findMany({
      where: { createdById: userId, isActive: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(customers, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const body = await request.json();
    const { firstName, lastName, email, phone }: Customer = body;

    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json({ message: 'Campos obrigatórios não foram preenchidos' }, { status: 400 });
    }

    const newCustomer = await prisma.customer.create({
      data: {
        ...body,
        birthDate: body.birthDate ? new Date(body.birthDate) : null,
        createdById: userId
      }
    });

    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}
