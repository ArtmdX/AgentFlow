// Estatísticas do Dashboard
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    // Stats básicas
    const [
      totalCustomers,
      totalTravels,
      totalRevenue,
      pendingTravels,
      confirmedTravels,
      recentTravels
    ] = await Promise.all([
      // Total de clientes do agente
      prisma.customer.count({
        where: {
          createdById: userId,
          isActive: true
        }
      }),

      // Total de viagens do agente
      prisma.travel.count({
        where: {
          agentId: userId
        }
      }),

      // Receita total (soma dos valores pagos)
      prisma.travel.aggregate({
        where: {
          agentId: userId
        },
        _sum: {
          paidValue: true
        }
      }),

      // Viagens pendentes (orçamento + aguardando pagamento)
      prisma.travel.count({
        where: {
          agentId: userId,
          status: {
            in: ['orcamento', 'aguardando_pagamento']
          }
        }
      }),

      // Viagens confirmadas
      prisma.travel.count({
        where: {
          agentId: userId,
          status: 'confirmada'
        }
      }),

      // Viagens recentes (últimas 5)
      prisma.travel.findMany({
        where: {
          agentId: userId
        },
        include: {
          customer: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 5
      })
    ]);

    // Dados para gráfico mensal (últimos 6 meses)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyStats = await prisma.travel.groupBy({
      by: ['createdAt'],
      where: {
        agentId: userId,
        createdAt: {
          gte: sixMonthsAgo
        }
      },
      _count: {
        id: true
      },
      _sum: {
        totalValue: true,
        paidValue: true
      }
    });

    // Processar dados mensais
    const monthlyData = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      const monthStats = monthlyStats.filter(stat => {
        if (!stat.createdAt) return false;
        const statDate = new Date(stat.createdAt);
        const statMonthYear = `${statDate.getFullYear()}-${String(statDate.getMonth() + 1).padStart(2, '0')}`;
        return statMonthYear === monthYear;
      });

      return {
        month: date.toLocaleDateString('pt-BR', { month: 'short' }),
        travels: monthStats.reduce((sum, stat) => sum + stat._count.id, 0),
        revenue: monthStats.reduce((sum, stat) => sum + (stat._sum.paidValue?.toNumber() || 0), 0)
      };
    });

    // Status distribution
    const statusStats = await prisma.travel.groupBy({
      by: ['status'],
      where: {
        agentId: userId
      },
      _count: {
        id: true
      }
    });

    const statusLabels: Record<string, string> = {
      'orcamento': 'Orçamentos',
      'aguardando_pagamento': 'Aguardando Pagamento',
      'confirmada': 'Confirmadas',
      'em_andamento': 'Em Andamento',
      'finalizada': 'Finalizadas',
      'cancelada': 'Canceladas'
    };

    const statusDistribution = statusStats.map(stat => ({
      status: stat.status ? (statusLabels[stat.status] || stat.status) : 'Unknown',
      count: stat._count.id
    }));

    return NextResponse.json({
      overview: {
        totalCustomers,
        totalTravels,
        totalRevenue: totalRevenue._sum.paidValue?.toNumber() || 0,
        pendingTravels,
        confirmedTravels
      },
      recentTravels: recentTravels.map(travel => ({
        id: travel.id,
        title: travel.title,
        customer: `${travel.customer.firstName} ${travel.customer.lastName}`,
        destination: travel.destination,
        departureDate: travel.departureDate,
        status: travel.status,
        totalValue: travel.totalValue?.toNumber() || 0
      })),
      monthlyData,
      statusDistribution
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return NextResponse.json({ message: 'Erro interno no servidor' }, { status: 500 });
  }
}
