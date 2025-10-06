// GET/POST travels
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Travel } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user.id) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  const agentId = session.user.id;
  const { searchParams } = new URL(request.url);

  // Extrair parâmetros de filtro
  const status = searchParams.get('status');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const destination = searchParams.get('destination');
  const customer = searchParams.get('customer');
  const sortBy = searchParams.get('sortBy') || 'departureDate';
  const sortOrder = searchParams.get('sortOrder') || 'desc';

  try {
    // Construir objeto where dinamicamente
    const where: {
      agentId: string;
      status?: string;
      departureDate?: {
        gte?: Date;
        lte?: Date;
      };
      destination?: {
        contains: string;
        mode: 'insensitive';
      };
      customer?: {
        OR: Array<{
          firstName?: { contains: string; mode: 'insensitive' };
          lastName?: { contains: string; mode: 'insensitive' };
        }>;
      };
    } = {
      agentId: agentId
    };

    // Filtro de status
    if (status) {
      where.status = status;
    }

    // Filtro de data
    if (startDate || endDate) {
      where.departureDate = {};
      if (startDate) {
        where.departureDate.gte = new Date(startDate);
      }
      if (endDate) {
        where.departureDate.lte = new Date(endDate);
      }
    }

    // Filtro de destino
    if (destination) {
      where.destination = {
        contains: destination,
        mode: 'insensitive'
      };
    }

    // Filtro de cliente
    if (customer) {
      where.customer = {
        OR: [
          { firstName: { contains: customer, mode: 'insensitive' } },
          { lastName: { contains: customer, mode: 'insensitive' } }
        ]
      };
    }

    // Construir ordenação
    const orderBy: Record<string, 'asc' | 'desc'> = {};
    if (sortBy === 'customer') {
      orderBy['customer'] = { firstName: sortOrder as 'asc' | 'desc' };
    } else {
      orderBy[sortBy] = sortOrder as 'asc' | 'desc';
    }

    const travels = await prisma.travel.findMany({
      where,
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: sortBy === 'customer' ? { customer: { firstName: sortOrder as 'asc' | 'desc' } } : { [sortBy]: sortOrder as 'asc' | 'desc' }
    });

    return NextResponse.json(travels);
  } catch (error) {
    console.error('Erro ao buscar viagens:', error);
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
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
    const { customerId, agentId, title, destination, departureCity, departureDate }: Travel = body;

    if (!customerId || !agentId || !title || !destination || !departureCity || !departureDate) {
      return NextResponse.json({ message: 'Campos obrigatórios não foram preenchidos' }, { status: 400 });
    }

    const newTravel = await prisma.travel.create({
      data: {
        ...body,
        agentId: userId,
        departureDate: body.departureDate ? new Date(body.departureDate) : null,
        returnDate: body.returnDate ? new Date(body.returnDate) : null
      }
    });

    return NextResponse.json(newTravel, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar orçamento: ', error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}
