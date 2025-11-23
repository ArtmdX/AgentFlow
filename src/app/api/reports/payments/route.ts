import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { currency_type, payment_method } from '@prisma/client';

interface WhereClause {
  paymentDate?: { gte?: Date; lte?: Date };
  currency?: currency_type;
  paymentMethod?: payment_method;
}

interface PaymentsByMethod {
  method: string;
  count: number;
  amount: number;
}

interface PaymentsByCurrency {
  currency: string;
  count: number;
  amount: number;
}

interface CashFlowByMonth {
  month: string;
  count: number;
  amount: number;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);

    // Filtros
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const currencyParam = searchParams.get('currency');
    const currency = (currencyParam && currencyParam !== 'all') ? currencyParam as currency_type : null;
    const paymentMethodParam = searchParams.get('paymentMethod');
    const paymentMethod = (paymentMethodParam && paymentMethodParam !== 'all') ? paymentMethodParam as payment_method : null;

    // Construir filtros do Prisma
    const whereClause: WhereClause = {};

    if (startDate || endDate) {
      whereClause.paymentDate = {};
      if (startDate) whereClause.paymentDate.gte = new Date(startDate);
      if (endDate) whereClause.paymentDate.lte = new Date(endDate);
    }

    if (currency) {
      whereClause.currency = currency;
    }

    if (paymentMethod) {
      whereClause.paymentMethod = paymentMethod;
    }

    // 1. Buscar todos os pagamentos
    const payments = await prisma.payment.findMany({
      where: whereClause,
      include: {
        travel: {
          select: {
            id: true,
            title: true,
            totalValue: true,
            paidValue: true,
            departureDate: true,
            customer: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          }
        },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    // 2. Total recebido
    const totalReceived = payments.reduce((sum, payment) => {
      return sum + Number(payment.amount);
    }, 0);

    // 3. Total a receber (todas as viagens com saldo pendente)
    const travelsWithBalance = await prisma.travel.findMany({
      where: {
        totalValue: {
          not: null
        }
      },
      select: {
        id: true,
        totalValue: true,
        paidValue: true,
        departureDate: true,
        status: true
      }
    });

    const totalToReceive = travelsWithBalance.reduce((sum, travel) => {
      const balance = Number(travel.totalValue || 0) - Number(travel.paidValue || 0);
      return sum + (balance > 0 ? balance : 0);
    }, 0);

    // 4. Total vencido (viagens com saldo e data de partida passada)
    const today = new Date();
    const overdueAmount = travelsWithBalance.reduce((sum, travel) => {
      const balance = Number(travel.totalValue || 0) - Number(travel.paidValue || 0);
      const isOverdue = travel.departureDate < today && balance > 0;
      return sum + (isOverdue ? balance : 0);
    }, 0);

    // 5. Pagamentos por método
    const paymentsByMethod = payments.reduce((acc: Record<string, PaymentsByMethod>, payment) => {
      const method = payment.paymentMethod;
      if (!acc[method]) {
        acc[method] = {
          method,
          count: 0,
          amount: 0
        };
      }
      acc[method].count++;
      acc[method].amount += Number(payment.amount);
      return acc;
    }, {});

    const paymentsByMethodArray = Object.values(paymentsByMethod);

    // 6. Pagamentos por moeda
    const paymentsByCurrency = payments.reduce((acc: Record<string, PaymentsByCurrency>, payment) => {
      const curr = payment.currency || 'BRL';
      if (!acc[curr]) {
        acc[curr] = {
          currency: curr,
          count: 0,
          amount: 0
        };
      }
      acc[curr].count++;
      acc[curr].amount += Number(payment.amount);
      return acc;
    }, {});

    const paymentsByCurrencyArray = Object.values(paymentsByCurrency);

    // 7. Fluxo de caixa ao longo do tempo (agrupado por mês)
    const cashFlowByMonth = payments.reduce((acc: Record<string, CashFlowByMonth>, payment) => {
      const date = new Date(payment.paymentDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!acc[monthKey]) {
        acc[monthKey] = {
          month: monthKey,
          count: 0,
          amount: 0
        };
      }
      acc[monthKey].count++;
      acc[monthKey].amount += Number(payment.amount);
      return acc;
    }, {});

    const cashFlowByMonthArray = Object.values(cashFlowByMonth).sort((a, b) =>
      a.month.localeCompare(b.month)
    );

    // 8. Análise de aging (contas a receber por faixa de vencimento)
    const agingAnalysis = {
      current: 0,      // 0-30 dias
      days30to60: 0,   // 30-60 dias
      days60to90: 0,   // 60-90 dias
      over90: 0        // mais de 90 dias
    };

    travelsWithBalance.forEach(travel => {
      const balance = Number(travel.totalValue || 0) - Number(travel.paidValue || 0);
      if (balance <= 0) return;

      const departureDate = new Date(travel.departureDate);
      const daysPast = Math.floor((today.getTime() - departureDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysPast < 0) {
        agingAnalysis.current += balance; // Ainda não venceu
      } else if (daysPast <= 30) {
        agingAnalysis.current += balance;
      } else if (daysPast <= 60) {
        agingAnalysis.days30to60 += balance;
      } else if (daysPast <= 90) {
        agingAnalysis.days60to90 += balance;
      } else {
        agingAnalysis.over90 += balance;
      }
    });

    // 9. Viagens com pagamentos vencidos (top 10)
    interface OverdueTravel {
      id: string;
      totalValue: number | null;
      paidValue: number | null;
      balance: number;
      departureDate: Date;
      status: string | null;
    }

    const overdueTravels = travelsWithBalance
      .map(travel => {
        const balance = Number(travel.totalValue || 0) - Number(travel.paidValue || 0);
        const isOverdue = travel.departureDate < today && balance > 0;
        return isOverdue ? ({ ...travel, balance } as OverdueTravel) : null;
      })
      .filter((t): t is OverdueTravel => t !== null)
      .sort((a, b) => b.balance - a.balance)
      .slice(0, 10);

    // 10. Pagamentos recentes (últimos 10)
    const recentPayments = payments
      .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
      .slice(0, 10)
      .map(payment => ({
        id: payment.id,
        amount: Number(payment.amount),
        currency: payment.currency,
        paymentMethod: payment.paymentMethod,
        paymentDate: payment.paymentDate,
        travelTitle: payment.travel.title,
        customerName: `${payment.travel.customer.firstName} ${payment.travel.customer.lastName}`,
        createdBy: `${payment.createdBy.firstName} ${payment.createdBy.lastName}`
      }));

    return NextResponse.json({
      metrics: {
        totalReceived,
        totalToReceive,
        overdueAmount,
        totalPayments: payments.length
      },
      paymentsByMethod: paymentsByMethodArray,
      paymentsByCurrency: paymentsByCurrencyArray,
      cashFlowByMonth: cashFlowByMonthArray,
      agingAnalysis: [
        { range: '0-30 dias', amount: agingAnalysis.current },
        { range: '30-60 dias', amount: agingAnalysis.days30to60 },
        { range: '60-90 dias', amount: agingAnalysis.days60to90 },
        { range: '90+ dias', amount: agingAnalysis.over90 }
      ],
      overdueTravels,
      recentPayments
    });
  } catch (error) {
    console.error('Erro ao gerar relatório de pagamentos:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar relatório de pagamentos' },
      { status: 500 }
    );
  }
}
