// GET/POST travels
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Travel } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user.id) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  const agentId = session.user.id;

  try {
    const travels = await prisma.travel.findMany({
      where: { agentId: agentId },
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: { departureDate: 'asc' }
    });
    if (!travels) return NextResponse.json({ message: 'Não foi possível encontrar viagens' }, { status: 500 });
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
