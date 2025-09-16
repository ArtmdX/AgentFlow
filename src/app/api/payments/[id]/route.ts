import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { paymentUpdateSchema } from '@/lib/validations';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

// GET - Buscar pagamento específico
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const paymentId = id;
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const payment = await prisma.payment.findFirst({
      where: {
        id: paymentId,
        travel: {
          agentId: userId
        }
      },
      include: {
        travel: {
          select: {
            id: true,
            title: true,
            customer: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        },
        createdBy: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    if (!payment) {
      return NextResponse.json({ message: 'Pagamento não encontrado' }, { status: 404 });
    }

    return NextResponse.json(payment);
  } catch (error) {
    console.error('Erro ao buscar pagamento:', error);
    return NextResponse.json({ message: 'Erro interno no servidor' }, { status: 500 });
  }
}

// PUT - Atualizar pagamento
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const paymentId = id;
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const body = await request.json();

    // Validar dados
    const validationResult = paymentUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({
        message: 'Dados inválidos',
        errors: validationResult.error.flatten().fieldErrors
      }, { status: 400 });
    }

    // Verificar se o pagamento existe e pertence a uma viagem do usuário
    const existingPayment = await prisma.payment.findFirst({
      where: {
        id: paymentId,
        travel: {
          agentId: userId
        }
      },
      include: {
        travel: true
      }
    });

    if (!existingPayment) {
      return NextResponse.json({ message: 'Pagamento não encontrado' }, { status: 404 });
    }

    const updateData = validationResult.data;

    // Se o valor está sendo alterado, verificar limites
    if (updateData.amount !== undefined) {
      const totalPaid = await prisma.payment.aggregate({
        where: {
          travelId: existingPayment.travelId,
          id: { not: paymentId } // Excluir o pagamento atual do cálculo
        },
        _sum: {
          amount: true
        }
      });

      const otherPaymentsTotal = totalPaid._sum.amount?.toNumber() || 0;
      const totalValue = existingPayment.travel.totalValue?.toNumber() || 0;

      if (otherPaymentsTotal + updateData.amount > totalValue) {
        return NextResponse.json({
          message: 'O valor do pagamento excede o saldo devedor da viagem'
        }, { status: 400 });
      }
    }

    // Preparar dados para atualização
    const updatePayload: Record<string, unknown> = {};

    if (updateData.amount !== undefined) updatePayload.amount = updateData.amount;
    if (updateData.currency !== undefined) updatePayload.currency = updateData.currency;
    if (updateData.paymentMethod !== undefined) updatePayload.paymentMethod = updateData.paymentMethod;
    if (updateData.paymentDate !== undefined) updatePayload.paymentDate = new Date(updateData.paymentDate);
    if (updateData.referenceNumber !== undefined) updatePayload.referenceNumber = updateData.referenceNumber;
    if (updateData.notes !== undefined) updatePayload.notes = updateData.notes;

    // Atualizar pagamento
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: updatePayload,
      include: {
        travel: true,
        createdBy: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    // Recalcular valor pago na viagem se o valor foi alterado
    if (updateData.amount !== undefined) {
      const totalPaid = await prisma.payment.aggregate({
        where: {
          travelId: existingPayment.travelId
        },
        _sum: {
          amount: true
        }
      });

      const newPaidValue = totalPaid._sum.amount?.toNumber() || 0;
      const totalValue = existingPayment.travel.totalValue?.toNumber() || 0;

      await prisma.travel.update({
        where: { id: existingPayment.travelId },
        data: {
          paidValue: newPaidValue,
          status: newPaidValue >= totalValue ? 'confirmada' :
                 newPaidValue > 0 ? 'aguardando_pagamento' : 'orcamento'
        }
      });
    }

    return NextResponse.json(updatedPayment);
  } catch (error) {
    console.error('Erro ao atualizar pagamento:', error);
    return NextResponse.json({ message: 'Erro interno no servidor' }, { status: 500 });
  }
}

// DELETE - Excluir pagamento
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const paymentId = id;
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    // Verificar se o pagamento existe e pertence a uma viagem do usuário
    const existingPayment = await prisma.payment.findFirst({
      where: {
        id: paymentId,
        travel: {
          agentId: userId
        }
      },
      include: {
        travel: true
      }
    });

    if (!existingPayment) {
      return NextResponse.json({ message: 'Pagamento não encontrado' }, { status: 404 });
    }

    // Excluir pagamento
    await prisma.payment.delete({
      where: { id: paymentId }
    });

    // Recalcular valor pago na viagem
    const totalPaid = await prisma.payment.aggregate({
      where: {
        travelId: existingPayment.travelId
      },
      _sum: {
        amount: true
      }
    });

    const newPaidValue = totalPaid._sum.amount?.toNumber() || 0;
    const totalValue = existingPayment.travel.totalValue?.toNumber() || 0;

    await prisma.travel.update({
      where: { id: existingPayment.travelId },
      data: {
        paidValue: newPaidValue,
        status: newPaidValue >= totalValue ? 'confirmada' :
               newPaidValue > 0 ? 'aguardando_pagamento' : 'orcamento'
      }
    });

    return NextResponse.json({ message: 'Pagamento excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir pagamento:', error);
    return NextResponse.json({ message: 'Erro interno no servidor' }, { status: 500 });
  }
}