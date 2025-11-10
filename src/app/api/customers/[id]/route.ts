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
    const { searchParams } = new URL(request.url);
    const override = searchParams.get('override') === 'true';

    // Validação com Zod
    const { customerUpdateSchema } = await import('@/lib/validations/customer');
    const validatedData = customerUpdateSchema.parse(body);

    // Verificar duplicatas (excluindo o próprio cliente, apenas se não for override)
    const duplicates: Array<{ field: string; value: string; customer: { id: string; firstName: string; lastName: string; email: string | null; documentNumber: string | null } }> = [];

    // Verificar email duplicado
    if (!override && validatedData.email) {
      const existingByEmail = await prisma.customer.findFirst({
        where: {
          email: validatedData.email,
          isActive: true,
          createdById: userId,
          id: { not: costumerId }, // Excluir o próprio cliente
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          documentNumber: true,
        },
      });

      if (existingByEmail) {
        duplicates.push({
          field: 'email',
          value: validatedData.email,
          customer: existingByEmail,
        });
      }
    }

    // Verificar documento duplicado
    if (!override && validatedData.documentNumber) {
      const cleanDoc = validatedData.documentNumber.replace(/\D/g, '');
      const existingByDocument = await prisma.customer.findFirst({
        where: {
          documentNumber: cleanDoc,
          isActive: true,
          createdById: userId,
          id: { not: costumerId }, // Excluir o próprio cliente
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          documentNumber: true,
        },
      });

      if (existingByDocument && !duplicates.find(d => d.customer.id === existingByDocument.id)) {
        duplicates.push({
          field: 'documentNumber',
          value: cleanDoc,
          customer: existingByDocument,
        });
      }
    }

    // Se houver duplicatas, retornar erro 409 com os dados
    if (duplicates.length > 0) {
      return NextResponse.json(
        {
          message: 'Cliente já cadastrado',
          code: 'DUPLICATE_CUSTOMER',
          duplicates,
        },
        { status: 409 }
      );
    }

    const updatedCustomer = await prisma.customer.update({
      where: {
        id: costumerId,
        createdById: userId,
        isActive: true
      },
      data: {
        ...validatedData,
        documentNumber: validatedData.documentNumber ? validatedData.documentNumber.replace(/\D/g, '') : undefined,
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
