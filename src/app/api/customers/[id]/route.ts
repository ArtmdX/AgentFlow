import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

// GET/PUT/DELETE customer
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const { id } = await params;
  const costumerId: string = id;

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  if (!costumerId) {
    return NextResponse.json({ message: 'ID do cliente não fornecido' }, { status: 400 });
  }

  const userId = session.user.id;
  try {
    const customer = await prisma.customer.findUnique({
      where: {
        id: costumerId,
        createdById: userId,
        isActive: true
      }
    });

    return NextResponse.json(customer, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function PUT() {
  return NextResponse.json({ message: 'Endpoint em desenvolvimento' });
}

export async function DELETE() {
  return NextResponse.json({ message: 'Endpoint em desenvolvimento' });
}
