import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Customer } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { handleAPIError } from '@/lib/error-handler';
import { AuthenticationError, NotFoundError, ValidationError } from '@/lib/errors';

// GET/PUT/DELETE customer
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;
    const costumerId: string = id;

    if (!session || !session.user?.id) {
      throw new AuthenticationError('Você precisa estar autenticado para acessar este cliente');
    }

    if (!costumerId) {
      throw new ValidationError('ID do cliente não fornecido');
    }

    const userId = session.user.id;

    const customer = await prisma.customer.findUnique({
      where: {
        id: costumerId,
        createdById: userId,
        isActive: true
      }
    });

    if (!customer) {
      throw new NotFoundError('Cliente não encontrado', 'Customer', costumerId);
    }

    return NextResponse.json(customer, { status: 200 });
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session || !session.user?.id) {
      throw new AuthenticationError('Você precisa estar autenticado para atualizar um cliente');
    }

    const costumerId: string = id;

    if (!costumerId) {
      throw new ValidationError('ID do cliente não fornecido');
    }

    const userId = session.user.id;
    const body: Partial<Customer> = await request.json();

    // Validação com Zod
    const { customerUpdateSchema } = await import('@/lib/validations/customer');
    const validatedData = customerUpdateSchema.parse(body);

    const updatedCustomer = await prisma.customer.update({
      where: {
        id: costumerId,
        createdById: userId,
        isActive: true
      },
      data: {
        ...validatedData,
        updatedAt: new Date(),
        birthDate: validatedData.birthDate ? new Date(validatedData.birthDate) : null
      }
    });

    return NextResponse.json(updatedCustomer, { status: 200 });
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session || !session.user?.id) {
      throw new AuthenticationError('Você precisa estar autenticado para deletar um cliente');
    }

    const costumerId: string = id;

    if (!costumerId) {
      throw new ValidationError('ID do cliente não fornecido');
    }

    const userId = session.user.id;

    // Deletar o cliente
    await prisma.customer.delete({
      where: {
        id: costumerId,
        createdById: userId
      }
    });

    return NextResponse.json(
      { message: 'Cliente deletado com sucesso' },
      { status: 200 }
    );
  } catch (error) {
    return handleAPIError(error);
  }
}
