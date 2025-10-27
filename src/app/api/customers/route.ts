// GET e POST de clientes

import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { handleAPIError } from '@/lib/error-handler';
import { AuthenticationError } from '@/lib/errors';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      throw new AuthenticationError('Você precisa estar autenticado para acessar esta página');
    }

    const userId = session.user.id;

    const [customers, totalCustomers, totalTravels, totalRevenue] = await Promise.all([
      prisma.customer.findMany({
        where: { createdById: userId, isActive: true },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.customer.count({
        where: { createdById: userId, isActive: true }
      }),
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
      stats: {
        totalCustomers,
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

    // Validação com Zod
    const { customerCreateSchema } = await import('@/lib/validations/customer');
    const validatedData = customerCreateSchema.parse(body);

    const newCustomer = await prisma.customer.create({
      data: {
        ...validatedData,
        birthDate: validatedData.birthDate ? new Date(validatedData.birthDate) : null,
        createdById: userId
      }
    });

    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error) {
    return handleAPIError(error);
  }
}
