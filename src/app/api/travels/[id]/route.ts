// GET/PUT/DELETE travel
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const travelId: string = id;
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  const userId = session.user.id;

  if (!travelId) {
    return NextResponse.json({ message: 'ID do cliente não fornecido' }, { status: 400 });
  }

  try {
    const travel = await prisma.travel.findFirst({
      where: {
        id: travelId,
        agentId: userId
      },
      include: {
        customer: true,
        passengers: true
      }
    });

    if (!travel) {
      throw new Error('A viagem não pôde ser encontrada');
    }
    return NextResponse.json(travel);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Erro interno no servidor' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const travelId: string = id;
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  if (!travelId) {
    return NextResponse.json({ message: 'ID do cliente não fornecido' }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const travelId: string = id;
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  if (!travelId) {
    return NextResponse.json({ message: 'ID do cliente não fornecido' }, { status: 400 });
  }
}
