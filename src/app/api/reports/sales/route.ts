import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { travel_status } from '@prisma/client';

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
    const agentId = searchParams.get('agentId');
    const statusParam = searchParams.get('status');
    const status = (statusParam && statusParam !== 'all') ? statusParam as travel_status : null;
    const destination = searchParams.get('destination');

    // Construir filtros do Prisma
    interface WhereClause {
      createdDate?: { gte?: Date; lte?: Date };
      agentId?: string;
      status?: travel_status;
      destination?: { contains: string; mode: 'insensitive' };
    }

    const whereClause: WhereClause = {};

    if (startDate || endDate) {
      whereClause.createdDate = {};
      if (startDate) whereClause.createdDate.gte = new Date(startDate);
      if (endDate) whereClause.createdDate.lte = new Date(endDate);
    }

    if (agentId && agentId !== 'all') {
      whereClause.agentId = agentId;
    }

    if (status) {
      whereClause.status = status;
    }

    if (destination) {
      whereClause.destination = {
        contains: destination,
        mode: 'insensitive'
      };
    }

    // 1. Métricas totais
    const travels = await prisma.travel.findMany({
      where: whereClause,
      include: {
        agent: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    const totalTravels = travels.length;
    const totalRevenue = travels.reduce((sum, travel) => {
      return sum + (travel.totalValue ? Number(travel.totalValue) : 0);
    }, 0);
    const averageTicket = totalTravels > 0 ? totalRevenue / totalTravels : 0;

    // 2. Taxa de conversão (orçamentos → confirmadas)
    const orcamentos = travels.filter(t => t.status === 'orcamento').length;
    const confirmadas = travels.filter(
      t => t.status === 'confirmada' || t.status === 'em_andamento' || t.status === 'finalizada'
    ).length;
    const conversionRate = orcamentos > 0 ? (confirmadas / (orcamentos + confirmadas)) * 100 : 0;

    // 3. Vendas por agente
    interface AgentSales {
      agentId: string;
      agentName: string;
      count: number;
      revenue: number;
    }

    const salesByAgent = travels.reduce((acc: Record<string, AgentSales>, travel) => {
      const agentKey = travel.agentId;
      if (!acc[agentKey]) {
        acc[agentKey] = {
          agentId: travel.agentId,
          agentName: `${travel.agent.firstName} ${travel.agent.lastName}`,
          count: 0,
          revenue: 0
        };
      }
      acc[agentKey].count++;
      acc[agentKey].revenue += travel.totalValue ? Number(travel.totalValue) : 0;
      return acc;
    }, {});

    const salesByAgentArray = Object.values(salesByAgent).sort((a, b) => b.revenue - a.revenue);

    // 4. Vendas por status
    interface StatusSales {
      status: string;
      count: number;
      revenue: number;
    }

    const salesByStatus = travels.reduce((acc: Record<string, StatusSales>, travel) => {
      const statusKey = travel.status || 'unknown';
      if (!acc[statusKey]) {
        acc[statusKey] = {
          status: statusKey,
          count: 0,
          revenue: 0
        };
      }
      acc[statusKey].count++;
      acc[statusKey].revenue += travel.totalValue ? Number(travel.totalValue) : 0;
      return acc;
    }, {});

    const salesByStatusArray = Object.values(salesByStatus);

    // 5. Top 5 destinos
    interface DestinationStats {
      destination: string;
      count: number;
      revenue: number;
    }

    const destinationCount = travels.reduce((acc: Record<string, DestinationStats>, travel) => {
      const dest = travel.destination;
      if (!acc[dest]) {
        acc[dest] = {
          destination: dest,
          count: 0,
          revenue: 0
        };
      }
      acc[dest].count++;
      acc[dest].revenue += travel.totalValue ? Number(travel.totalValue) : 0;
      return acc;
    }, {});

    const topDestinations = Object.values(destinationCount)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // 6. Vendas ao longo do tempo (agrupadas por mês)
    interface MonthlySales {
      month: string;
      count: number;
      revenue: number;
    }

    const salesByMonth = travels.reduce((acc: Record<string, MonthlySales>, travel) => {
      if (!travel.createdDate) return acc;

      const date = new Date(travel.createdDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!acc[monthKey]) {
        acc[monthKey] = {
          month: monthKey,
          count: 0,
          revenue: 0
        };
      }
      acc[monthKey].count++;
      acc[monthKey].revenue += travel.totalValue ? Number(travel.totalValue) : 0;
      return acc;
    }, {});

    const salesByMonthArray = Object.values(salesByMonth).sort((a, b) =>
      a.month.localeCompare(b.month)
    );

    // 7. Top 5 clientes
    interface CustomerRevenue {
      customerId: string;
      customerName: string;
      count: number;
      revenue: number;
    }

    const customerRevenue = travels.reduce((acc: Record<string, CustomerRevenue>, travel) => {
      const customerId = travel.customerId;
      if (!acc[customerId]) {
        acc[customerId] = {
          customerId: customerId,
          customerName: `${travel.customer.firstName} ${travel.customer.lastName}`,
          count: 0,
          revenue: 0
        };
      }
      acc[customerId].count++;
      acc[customerId].revenue += travel.totalValue ? Number(travel.totalValue) : 0;
      return acc;
    }, {});

    const topCustomers = Object.values(customerRevenue)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return NextResponse.json({
      metrics: {
        totalTravels,
        totalRevenue,
        averageTicket,
        conversionRate,
        orcamentos,
        confirmadas
      },
      salesByAgent: salesByAgentArray,
      salesByStatus: salesByStatusArray,
      topDestinations,
      salesByMonth: salesByMonthArray,
      topCustomers
    });
  } catch (error) {
    console.error('Erro ao gerar relatório de vendas:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar relatório de vendas' },
      { status: 500 }
    );
  }
}
