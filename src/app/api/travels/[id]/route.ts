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

  const userId = session.user.id;

  if (!travelId) {
    return NextResponse.json({ message: 'ID da viagem não fornecido' }, { status: 400 });
  }

  try {
    const body = await request.json();

    // Verificar se a viagem existe e pertence ao agente
    const existingTravel = await prisma.travel.findFirst({
      where: {
        id: travelId,
        agentId: userId
      }
    });

    if (!existingTravel) {
      return NextResponse.json({ message: 'Viagem não encontrada' }, { status: 404 });
    }

    // Preparar dados para atualização
    const updateData: Record<string, unknown> = {};

    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.destination !== undefined) updateData.destination = body.destination;
    if (body.departureCity !== undefined) updateData.departureCity = body.departureCity;
    if (body.departureDate !== undefined) updateData.departureDate = new Date(body.departureDate);
    if (body.returnDate !== undefined) updateData.returnDate = body.returnDate ? new Date(body.returnDate) : null;
    if (body.totalValue !== undefined) updateData.totalValue = body.totalValue;
    if (body.paidValue !== undefined) updateData.paidValue = body.paidValue;
    if (body.currency !== undefined) updateData.currency = body.currency;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.isInternational !== undefined) updateData.isInternational = body.isInternational;
    if (body.passengerCount !== undefined) updateData.passengerCount = body.passengerCount;
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.internalNotes !== undefined) updateData.internalNotes = body.internalNotes;

    const updatedTravel = await prisma.travel.update({
      where: { id: travelId },
      data: updateData,
      include: {
        customer: true,
        passengers: true
      }
    });

    return NextResponse.json(updatedTravel);
  } catch (error) {
    console.error('Erro ao atualizar viagem:', error);
    return NextResponse.json({ message: 'Erro interno no servidor' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const travelId: string = id;
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  const userId = session.user.id;

  if (!travelId) {
    return NextResponse.json({ message: 'ID da viagem não fornecido' }, { status: 400 });
  }

  try {
    // Verificar se a viagem existe e pertence ao agente
    const existingTravel = await prisma.travel.findFirst({
      where: {
        id: travelId,
        agentId: userId
      }
    });

    if (!existingTravel) {
      return NextResponse.json({ message: 'Viagem não encontrada' }, { status: 404 });
    }

    // Deletar a viagem (cascata irá deletar passengers, activities e payments)
    await prisma.travel.delete({
      where: { id: travelId }
    });

    return NextResponse.json({ message: 'Viagem deletada com sucesso' }, { status: 200 });
  } catch (error) {
    console.error('Erro ao deletar viagem:', error);
    return NextResponse.json({ message: 'Erro interno no servidor' }, { status: 500 });
  }
}
