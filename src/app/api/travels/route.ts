// GET/POST travels
import prisma from '@/lib/prisma';
import { travel_status } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/authorization';
import { Permission, hasPermission } from '@/lib/permissions';
import { handleAPIError } from '@/lib/error-handler';

export async function GET(request: Request) {
  try {
    const session = await getAuthSession();
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

  // Construir objeto where dinamicamente
  const where: {
    agentId?: string;
    status?: travel_status;
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
    where.status = status as travel_status;
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

  // Se tiver permissão de ver todas as viagens, não filtra por agentId
  const canViewAll = hasPermission(session, Permission.VIEW_ALL_TRAVELS);
  if (canViewAll) {
    delete where.agentId;
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
    return handleAPIError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();
  const userId = session.user.id;
  const body = await request.json();

  // Validação com Zod
  const { travelCreateSchema } = await import('@/lib/validations/travel');
  const validatedData = travelCreateSchema.parse(body);

  const newTravel = await prisma.travel.create({
    data: {
      ...validatedData,
      agentId: userId,
      departureDate: validatedData.departureDate ? new Date(validatedData.departureDate) : new Date(),
      returnDate: validatedData.returnDate ? new Date(validatedData.returnDate) : null
    }
  });

  return NextResponse.json(newTravel, { status: 201 });
  } catch (error) {
    return handleAPIError(error);
  }
}
