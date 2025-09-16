import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

// GET - Listar todos os pagamentos do agente
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  const userId = session.user.id;
  const { searchParams } = new URL(request.url);

  // Parâmetros de filtro
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const travelId = searchParams.get('travelId');
  const customerId = searchParams.get('customerId');
  const paymentMethod = searchParams.get('paymentMethod');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  try {
    // Construir filtros
    const where: {
      travel: {
        agentId: string;
        customerId?: string;
      };
      travelId?: string;
      paymentMethod?: string;
      paymentDate?: {
        gte?: Date;
        lte?: Date;
      };
    } = {
      travel: {
        agentId: userId
      }
    };

    if (travelId) {
      where.travelId = travelId;
    }

    if (customerId) {
      where.travel.customerId = customerId;
    }

    if (paymentMethod) {
      where.paymentMethod = paymentMethod;
    }

    if (startDate || endDate) {
      where.paymentDate = {};
      if (startDate) {
        where.paymentDate.gte = new Date(startDate);
      }
      if (endDate) {
        where.paymentDate.lte = new Date(endDate);
      }
    }

    // Buscar pagamentos com paginação
    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: {
          travel: {
            select: {
              id: true,
              title: true,
              destination: true,
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
        },
        orderBy: {
          paymentDate: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.payment.count({ where })
    ]);

    // Calcular estatísticas
    const stats = await prisma.payment.aggregate({
      where,
      _sum: {
        amount: true
      },
      _count: {
        id: true
      }
    });

    // Estatísticas por método de pagamento
    const paymentMethodStats = await prisma.payment.groupBy({
      by: ['paymentMethod'],
      where,
      _sum: {
        amount: true
      },
      _count: {
        id: true
      }
    });

    // Estatísticas por moeda
    const currencyStats = await prisma.payment.groupBy({
      by: ['currency'],
      where,
      _sum: {
        amount: true
      },
      _count: {
        id: true
      }
    });

    return NextResponse.json({
      payments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      stats: {
        totalAmount: stats._sum.amount?.toNumber() || 0,
        totalCount: stats._count.id || 0,
        byPaymentMethod: paymentMethodStats.map(stat => ({
          method: stat.paymentMethod,
          amount: stat._sum.amount?.toNumber() || 0,
          count: stat._count.id
        })),
        byCurrency: currencyStats.map(stat => ({
          currency: stat.currency,
          amount: stat._sum.amount?.toNumber() || 0,
          count: stat._count.id
        }))
      }
    });
  } catch (error) {
    console.error('Erro ao buscar pagamentos:', error);
    return NextResponse.json({ message: 'Erro interno no servidor' }, { status: 500 });
  }
}