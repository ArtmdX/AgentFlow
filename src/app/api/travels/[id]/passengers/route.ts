import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Passenger } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const body: Passenger[] = await request.json();
    let newPassengers: Passenger[] = [];
    for (const passenger of body) {
      const { firstName, lastName, documentNumber, documentType, birthDate, gender } = passenger;

      if (!firstName || !lastName || !documentNumber || !documentType || !birthDate || !gender) {
        return NextResponse.json({ message: 'Campos obrigatórios não foram preenchidos' }, { status: 400 });
      }

      const newPassenger: Passenger = await prisma.passenger.create({
        data: {
          ...passenger,
          agentId: userId,
          travelId: id,
          birthDate: new Date(passenger.birthDate)
        }
      });
      newPassengers.push(newPassenger);
    }
    NextResponse.json(newPassengers, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar orçamento: ', error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}
