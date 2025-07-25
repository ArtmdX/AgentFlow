import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Customer } from '@prisma/client';
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

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const { id } = await params;
  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }
  const costumerId: string = id;

  if (!costumerId) {
    return NextResponse.json({ message: 'ID do cliente não fornecido' }, { status: 400 });
  }
  const userId = session.user.id;
  try {
    const body: Partial<Customer> = await request.json();
    const { firstName, lastName, email, phone } = body;
    console.log('Dados recebidos para atualização:', body);
    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json({ message: 'Dados incompletos' }, { status: 400 });
    }
    const updatedCustomer = await prisma.customer.update({
      where: {
        id: costumerId,
        createdById: userId,
        isActive: true
      },
      data: {
        ...body,
        updatedAt: new Date(),
        birthDate: body.birthDate ? new Date(body.birthDate) : null
      }
    });
    return NextResponse.json(updatedCustomer, { status: 200 });
  } catch (error) {
    console.error('Erro ao atualizar cliente: ', error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const { id } = await params;
  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }
  const costumerId: string = id;

  if (!costumerId) {
    return NextResponse.json({ message: 'ID do cliente não fornecido' }, { status: 400 });
  }
  const userId = session.user.id;

  if (!userId) {
    return NextResponse.json({ message: 'ID do usuário inválido' }, { status: 400 });
  }
  try {
    await prisma.customer.delete({
      where: {
        id: id,
        createdById: userId
      }
    });
    return NextResponse.json({ message: 'Cliente deletado com sucesso' }, { status: 200 });
  } catch (error) {
    console.error('Erro ao deletar cliente: ', error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}
