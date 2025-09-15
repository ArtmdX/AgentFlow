import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const { id } = await params;
  const travelId = id;

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    // Verificar se a viagem existe e pertence ao usuário
    const travel = await prisma.travel.findFirst({
      where: {
        id: travelId,
        agentId: userId
      }
    });

    if (!travel) {
      return NextResponse.json({ message: 'Viagem não encontrada' }, { status: 404 });
    }

    const body = await request.json();

    if (!Array.isArray(body) || body.length === 0) {
      return NextResponse.json({ message: 'Dados de passageiros inválidos' }, { status: 400 });
    }

    const passengersData = body.map(passenger => {
      const { firstName, lastName, documentNumber, documentType, birthDate, gender } = passenger;

      if (!firstName || !lastName || !documentNumber || !documentType || !birthDate || !gender) {
        throw new Error('Campos obrigatórios não foram preenchidos');
      }

      return {
        firstName,
        lastName,
        documentNumber,
        documentType,
        birthDate: new Date(birthDate),
        gender,
        agentId: userId,
        travelId: travelId,
        isPrimary: false
      };
    });

    await prisma.passenger.createMany({
      data: passengersData
    });

    // Buscar os passageiros criados para retornar
    const newPassengers = await prisma.passenger.findMany({
      where: {
        travelId: travelId,
        agentId: userId
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: passengersData.length
    });

    return NextResponse.json(newPassengers, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar passageiros:', error);
    return NextResponse.json({
      message: error instanceof Error ? error.message : 'Erro interno do servidor'
    }, { status: 500 });
  }
}
