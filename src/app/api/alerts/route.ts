import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

interface Alert {
  id: string;
  type: 'upcoming' | 'due_soon' | 'overdue';
  title: string;
  description: string;
  actionUrl: string;
  severity: 'info' | 'warning' | 'error';
  travelId: string;
  customerName: string;
  destination: string;
  date?: Date;
  amount?: number;
}

/**
 * GET /api/alerts
 * Get current alerts for the logged-in user
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const sevenDaysFromNow = new Date(now);
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    sevenDaysFromNow.setHours(23, 59, 59, 999);

    const threeDaysFromNow = new Date(now);
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    threeDaysFromNow.setHours(23, 59, 59, 999);

    const alerts: Alert[] = [];

    // 1. Check for upcoming travels (7 days)
    const upcomingTravels = await prisma.travel.findMany({
      where: {
        agentId: userId,
        departureDate: {
          gte: now,
          lte: sevenDaysFromNow,
        },
        status: {
          in: ['confirmada', 'em_andamento'],
        },
      },
      include: {
        customer: {
          select: { firstName: true, lastName: true },
        },
      },
      orderBy: { departureDate: 'asc' },
    });

    upcomingTravels.forEach((travel) => {
      alerts.push({
        id: `upcoming-${travel.id}`,
        type: 'upcoming',
        severity: 'info',
        title: 'Viagem próxima',
        description: `Partida em ${Math.ceil((new Date(travel.departureDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))} dias`,
        actionUrl: `/dashboard/travels/${travel.id}`,
        travelId: travel.id,
        customerName: `${travel.customer.firstName} ${travel.customer.lastName}`,
        destination: travel.destination,
        date: travel.departureDate,
      });
    });

    // 2. Check for payments due soon (3 days before departure with pending balance)
    const paymentsDueSoon = await prisma.travel.findMany({
      where: {
        agentId: userId,
        departureDate: {
          gte: now,
          lte: threeDaysFromNow,
        },
        status: {
          in: ['aguardando_pagamento', 'confirmada'],
        },
      },
      include: {
        customer: {
          select: { firstName: true, lastName: true },
        },
      },
      orderBy: { departureDate: 'asc' },
    });

    paymentsDueSoon.forEach((travel) => {
      const balance = Number(travel.totalValue) - Number(travel.paidValue);
      if (balance > 0) {
        alerts.push({
          id: `due-soon-${travel.id}`,
          type: 'due_soon',
          severity: 'warning',
          title: 'Pagamento pendente',
          description: `Partida em ${Math.ceil((new Date(travel.departureDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))} dias com saldo devedor`,
          actionUrl: `/dashboard/travels/${travel.id}`,
          travelId: travel.id,
          customerName: `${travel.customer.firstName} ${travel.customer.lastName}`,
          destination: travel.destination,
          date: travel.departureDate,
          amount: balance,
        });
      }
    });

    // 3. Check for overdue payments
    const overduePayments = await prisma.travel.findMany({
      where: {
        agentId: userId,
        departureDate: {
          lt: now,
        },
        status: {
          notIn: ['finalizada', 'cancelada'],
        },
      },
      include: {
        customer: {
          select: { firstName: true, lastName: true },
        },
      },
      orderBy: { departureDate: 'desc' },
      take: 10, // Limit to most recent 10
    });

    overduePayments.forEach((travel) => {
      const balance = Number(travel.totalValue) - Number(travel.paidValue);
      if (balance > 0) {
        const daysOverdue = Math.floor((now.getTime() - new Date(travel.departureDate).getTime()) / (1000 * 60 * 60 * 24));
        alerts.push({
          id: `overdue-${travel.id}`,
          type: 'overdue',
          severity: 'error',
          title: 'Pagamento atrasado',
          description: `${daysOverdue} dias de atraso`,
          actionUrl: `/dashboard/travels/${travel.id}`,
          travelId: travel.id,
          customerName: `${travel.customer.firstName} ${travel.customer.lastName}`,
          destination: travel.destination,
          date: travel.departureDate,
          amount: balance,
        });
      }
    });

    // Sort alerts by severity and date
    const sortOrder = { error: 0, warning: 1, info: 2 };
    alerts.sort((a, b) => {
      if (a.severity !== b.severity) {
        return sortOrder[a.severity] - sortOrder[b.severity];
      }
      if (a.date && b.date) {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      return 0;
    });

    return NextResponse.json({
      alerts,
      summary: {
        total: alerts.length,
        overdue: alerts.filter((a) => a.type === 'overdue').length,
        due_soon: alerts.filter((a) => a.type === 'due_soon').length,
        upcoming: alerts.filter((a) => a.type === 'upcoming').length,
      },
    });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
}
