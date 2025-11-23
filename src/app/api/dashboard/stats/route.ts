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

    // Dados para gráfico mensal (últimos 12 meses)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const travelsForMonthly = await prisma.travel.findMany({
      where: {
        agentId: userId,
        createdDate: {
          gte: twelveMonthsAgo
        }
      },
      select: {
        createdDate: true,
        totalValue: true,
        paidValue: true
      }
    });

    // Processar dados mensais
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (11 - i));
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      const monthTravels = travelsForMonthly.filter(travel => {
        if (!travel.createdDate) return false;
        const travelDate = new Date(travel.createdDate);
        const travelMonthYear = `${travelDate.getFullYear()}-${String(travelDate.getMonth() + 1).padStart(2, '0')}`;
        return travelMonthYear === monthYear;
      });

      return {
        month: date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
        travels: monthTravels.length,
        revenue: monthTravels.reduce((sum, travel) => sum + (travel.totalValue?.toNumber() || 0), 0),
        paid: monthTravels.reduce((sum, travel) => sum + (travel.paidValue?.toNumber() || 0), 0)
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

    // Top 5 clientes por receita
    const allTravelsWithCustomer = await prisma.travel.findMany({
      where: {
        agentId: userId
      },
      select: {
        customerId: true,
        totalValue: true,
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    const customerRevenue: Record<string, { customerId: string; customerName: string; revenue: number; travelCount: number }> = {};

    allTravelsWithCustomer.forEach(travel => {
      const customerId = travel.customerId;
      if (!customerRevenue[customerId]) {
        customerRevenue[customerId] = {
          customerId,
          customerName: `${travel.customer.firstName} ${travel.customer.lastName}`,
          revenue: 0,
          travelCount: 0
        };
      }
      customerRevenue[customerId].revenue += travel.totalValue?.toNumber() || 0;
      customerRevenue[customerId].travelCount++;
    });

    const topCustomers = Object.values(customerRevenue)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Top 5 destinos
    const destinationStats: Record<string, { destination: string; count: number; revenue: number }> = {};

    const travelsWithDestination = await prisma.travel.findMany({
      where: {
        agentId: userId
      },
      select: {
        destination: true,
        totalValue: true
      }
    });

    travelsWithDestination.forEach(travel => {
      const dest = travel.destination;
      if (!destinationStats[dest]) {
        destinationStats[dest] = {
          destination: dest,
          count: 0,
          revenue: 0
        };
      }
      destinationStats[dest].count++;
      destinationStats[dest].revenue += travel.totalValue?.toNumber() || 0;
    });

    const topDestinations = Object.values(destinationStats)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Próximas partidas (próximos 30 dias)
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    const upcomingDepartures = await prisma.travel.findMany({
      where: {
        agentId: userId,
        departureDate: {
          gte: today,
          lte: thirtyDaysFromNow
        },
        status: {
          in: ['confirmada', 'em_andamento']
        }
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
        departureDate: 'asc'
      },
      take: 10
    });

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
      statusDistribution,
      topCustomers,
      topDestinations,
      upcomingDepartures: upcomingDepartures.map(travel => ({
        id: travel.id,
        title: travel.title,
        customer: `${travel.customer.firstName} ${travel.customer.lastName}`,
        destination: travel.destination,
        departureDate: travel.departureDate,
        status: travel.status,
        totalValue: travel.totalValue?.toNumber() || 0,
        paidValue: travel.paidValue?.toNumber() || 0
      }))
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return NextResponse.json({ message: 'Erro interno no servidor' }, { status: 500 });
  }
}
