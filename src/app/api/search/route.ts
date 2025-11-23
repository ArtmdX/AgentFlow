import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        customers: [],
        travels: [],
        passengers: [],
        payments: []
      });
    }

    const searchTerm = query.trim();
    const userId = session.user.id;

    // Buscar em paralelo em todas as entidades
    const [customers, travels, passengers, payments] = await Promise.all([
      // 1. Buscar clientes
      prisma.customer.findMany({
        where: {
          createdById: userId,
          OR: [
            { firstName: { contains: searchTerm, mode: 'insensitive' } },
            { lastName: { contains: searchTerm, mode: 'insensitive' } },
            { email: { contains: searchTerm, mode: 'insensitive' } },
            { phone: { contains: searchTerm, mode: 'insensitive' } },
            { documentNumber: { contains: searchTerm, mode: 'insensitive' } }
          ]
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          documentNumber: true
        },
        take: 5
      }),

      // 2. Buscar viagens
      prisma.travel.findMany({
        where: {
          agentId: userId,
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { destination: { contains: searchTerm, mode: 'insensitive' } },
            { departureCity: { contains: searchTerm, mode: 'insensitive' } },
            {
              customer: {
                OR: [
                  { firstName: { contains: searchTerm, mode: 'insensitive' } },
                  { lastName: { contains: searchTerm, mode: 'insensitive' } }
                ]
              }
            }
          ]
        },
        select: {
          id: true,
          title: true,
          destination: true,
          departureCity: true,
          departureDate: true,
          status: true,
          totalValue: true,
          customer: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        },
        take: 5
      }),

      // 3. Buscar passageiros
      prisma.passenger.findMany({
        where: {
          agentId: userId,
          OR: [
            { firstName: { contains: searchTerm, mode: 'insensitive' } },
            { lastName: { contains: searchTerm, mode: 'insensitive' } },
            { documentNumber: { contains: searchTerm, mode: 'insensitive' } }
          ]
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          documentNumber: true,
          travelId: true,
          travel: {
            select: {
              title: true,
              destination: true
            }
          }
        },
        take: 5
      }),

      // 4. Buscar pagamentos (por referência)
      prisma.payment.findMany({
        where: {
          travel: {
            agentId: userId
          },
          OR: [
            { referenceNumber: { contains: searchTerm, mode: 'insensitive' } }
          ]
        },
        select: {
          id: true,
          amount: true,
          currency: true,
          paymentMethod: true,
          paymentDate: true,
          referenceNumber: true,
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
          }
        },
        take: 5
      })
    ]);

    // Formatar resultados
    const results = {
      customers: customers.map(c => ({
        id: c.id,
        type: 'customer' as const,
        title: `${c.firstName} ${c.lastName}`,
        subtitle: c.email || c.phone || c.documentNumber || '',
        url: `/dashboard/customers/${c.id}`
      })),

      travels: travels.map(t => ({
        id: t.id,
        type: 'travel' as const,
        title: t.title,
        subtitle: `${t.customer.firstName} ${t.customer.lastName} - ${t.destination}`,
        url: `/dashboard/travels/${t.id}`,
        meta: {
          status: t.status,
          departureDate: t.departureDate,
          totalValue: t.totalValue ? Number(t.totalValue) : 0
        }
      })),

      passengers: passengers.map(p => ({
        id: p.id,
        type: 'passenger' as const,
        title: `${p.firstName} ${p.lastName}`,
        subtitle: `${p.travel.title} - ${p.travel.destination}`,
        url: `/dashboard/travels/${p.travelId}`,
        meta: {
          documentNumber: p.documentNumber
        }
      })),

      payments: payments.map(p => ({
        id: p.id,
        type: 'payment' as const,
        title: `Pagamento ${p.referenceNumber || '#' + p.id.substring(0, 8)}`,
        subtitle: `${p.travel.customer.firstName} ${p.travel.customer.lastName} - ${p.travel.title}`,
        url: `/dashboard/travels/${p.travel.id}`,
        meta: {
          amount: Number(p.amount),
          currency: p.currency,
          paymentDate: p.paymentDate
        }
      }))
    };

    return NextResponse.json(results);
  } catch (error) {
    console.error('Erro na busca global:', error);
    return NextResponse.json(
      { error: 'Erro ao realizar busca' },
      { status: 500 }
    );
  }
}
