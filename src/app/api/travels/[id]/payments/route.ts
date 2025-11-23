import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { paymentCreateSchema } from '@/lib/validations';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { logPayment } from '@/services/activityService';
import { updateTravelStatusBasedOnPayments } from '@/lib/calculations';

// GET - Listar pagamentos de uma viagem
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const travelId = id;
  const session = await getServerSession(authOptions);

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

    // Buscar pagamentos da viagem
    const payments = await prisma.payment.findMany({
      where: {
        travelId: travelId
      },
      include: {
        createdBy: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: {
        paymentDate: 'desc'
      }
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error('Erro ao buscar pagamentos:', error);
    return NextResponse.json({ message: 'Erro interno no servidor' }, { status: 500 });
  }
}

// POST - Criar novo pagamento
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const travelId = id;
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const body = await request.json();

    // Validar dados
    const validationResult = paymentCreateSchema.safeParse({
      ...body,
      travelId
    });

    if (!validationResult.success) {
      return NextResponse.json({
        message: 'Dados inválidos',
        errors: validationResult.error.flatten().fieldErrors
      }, { status: 400 });
    }

    const { amount, currency, paymentMethod, paymentDate, referenceNumber, notes } = validationResult.data;

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

    // Verificar se o valor do pagamento não excede o valor total da viagem
    const totalPaid = await prisma.payment.aggregate({
      where: {
        travelId: travelId
      },
      _sum: {
        amount: true
      }
    });

    const currentPaidValue = totalPaid._sum.amount?.toNumber() || 0;
    const totalValue = travel.totalValue?.toNumber() || 0;

    if (currentPaidValue + amount > totalValue) {
      return NextResponse.json({
        message: 'O valor do pagamento excede o saldo devedor da viagem'
      }, { status: 400 });
    }

    // Criar pagamento
    const payment = await prisma.payment.create({
      data: {
        travelId,
        amount,
        currency,
        paymentMethod,
        paymentDate: new Date(paymentDate),
        referenceNumber,
        notes,
        createdById: userId
      },
      include: {
        createdBy: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    // Atualizar valor pago na viagem
    const newPaidValue = currentPaidValue + amount;
    await prisma.travel.update({
      where: { id: travelId },
      data: {
        paidValue: newPaidValue
      }
    });

    // Atualizar status automaticamente baseado nos pagamentos
    await updateTravelStatusBasedOnPayments(travelId).catch(err =>
      console.error('Erro ao atualizar status da viagem:', err)
    );

    // Log de pagamento (não bloqueia)
    logPayment(userId, travelId, amount, currency, paymentMethod).catch(err =>
      console.error('Erro ao criar log de pagamento:', err)
    );

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar pagamento:', error);
    return NextResponse.json({ message: 'Erro interno no servidor' }, { status: 500 });
  }
}