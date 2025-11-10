// GET e POST de clientes

import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { handleAPIError } from '@/lib/error-handler';
import { AuthenticationError } from '@/lib/errors';
import { logCustomerCreated } from '@/services/activityService';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      throw new AuthenticationError('Você precisa estar autenticado para acessar esta página');
    }

    const userId = session.user.id;

    // Parâmetros de paginação
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '25', 10);
    const skip = (page - 1) * limit;

    // Filtros opcionais
    const search = searchParams.get('search') || '';

    // Construir where clause
    const where: {
      createdById: string;
      isActive: boolean;
      OR?: Array<{
        firstName?: { contains: string; mode: 'insensitive' };
        lastName?: { contains: string; mode: 'insensitive' };
        email?: { contains: string; mode: 'insensitive' };
        documentNumber?: { contains: string };
      }>;
    } = {
      createdById: userId,
      isActive: true
    };

    // Busca por nome, email ou documento
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { documentNumber: { contains: search } }
      ];
    }

    const [customers, total, totalTravels, totalRevenue] = await Promise.all([
      prisma.customer.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.customer.count({ where }),
      prisma.travel.count({
        where: { agentId: userId }
      }),
      prisma.payment.aggregate({
        where: {
          travel: {
            agentId: userId
          }
        },
        _sum: {
          amount: true
        }
      })
    ]);

    return NextResponse.json({
      customers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      stats: {
        totalCustomers: total,
        totalTravels,
        totalRevenue: totalRevenue._sum.amount?.toNumber() || 0
      }
    }, { status: 200 });
  } catch (error) {
    return handleAPIError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      throw new AuthenticationError('Você precisa estar autenticado para criar um cliente');
    }

    const userId = session.user.id;

    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const override = searchParams.get('override') === 'true';

    // Validação com Zod
    const { customerCreateSchema } = await import('@/lib/validations/customer');
    const validatedData = customerCreateSchema.parse(body);

    // Verificar duplicatas (apenas se não for override)
    const duplicates: Array<{ field: string; value: string; customer: { id: string; firstName: string; lastName: string; email: string | null; documentNumber: string | null } }> = [];

    // Verificar email duplicado
    if (!override && validatedData.email) {
      const existingByEmail = await prisma.customer.findFirst({
        where: {
          email: validatedData.email,
          isActive: true,
          createdById: userId,
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

    const newCustomer = await prisma.customer.create({
      data: {
        ...validatedData,
        documentNumber: validatedData.documentNumber ? validatedData.documentNumber.replace(/\D/g, '') : undefined,
        birthDate: validatedData.birthDate ? new Date(validatedData.birthDate) : null,
        createdById: userId
      }
    });

    // Log de criação do cliente (não bloqueia)
    const customerName = `${newCustomer.firstName} ${newCustomer.lastName}`;
    logCustomerCreated(userId, newCustomer.id, customerName).catch(err =>
      console.error('Erro ao criar log de atividade:', err)
    );

    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error) {
    return handleAPIError(error);
  }
}
