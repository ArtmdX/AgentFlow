import prisma from '@/lib/prisma';
import { createNotification, queueEmail } from '@/services/notificationService';

/**
 * Cron job: Process all alerts daily at 8 AM
 * Checks for upcoming travels, payments due, overdue payments, etc.
 */
export async function alertsJob() {
  console.log('[Cron:Alerts] Starting daily alerts check...');

  try {
    await Promise.all([
      checkUpcomingTravels(),
      checkPaymentsDueSoon(),
      checkOverduePayments(),
    ]);

    console.log('[Cron:Alerts] Daily alerts processed successfully');
  } catch (error) {
    console.error('[Cron:Alerts] Error processing alerts:', error);
  }
}

/**
 * Alert: Travels departing in 7 days
 */
async function checkUpcomingTravels() {
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
  sevenDaysFromNow.setHours(0, 0, 0, 0);

  const eightDaysFromNow = new Date(sevenDaysFromNow);
  eightDaysFromNow.setDate(eightDaysFromNow.getDate() + 1);

  const upcomingTravels = await prisma.travel.findMany({
    where: {
      departureDate: {
        gte: sevenDaysFromNow,
        lt: eightDaysFromNow,
      },
      status: {
        in: ['confirmada', 'em_andamento'],
      },
    },
    include: {
      customer: true,
      agent: true,
    },
  });

  console.log(`[Alerts] Found ${upcomingTravels.length} travels departing in 7 days`);

  for (const travel of upcomingTravels) {
    // Create in-app notification
    await createNotification({
      type: 'info',
      priority: 'high',
      title: 'Viagem próxima',
      message: `A viagem de ${`${travel.customer.firstName} ${travel.customer.lastName}`} para ${travel.destination} parte em 7 dias.`,
      actionUrl: `/dashboard/travels/${travel.id}`,
      userId: travel.agentId,
      relatedEntity: 'travel',
      relatedEntityId: travel.id,
    });

    // Queue email
    await queueEmail({
      templateType: 'travel_upcoming',
      userId: travel.agentId,
      variables: {
        agentName: `${travel.agent.firstName} ${travel.agent.lastName}`,
        customerName: `${travel.customer.firstName} ${travel.customer.lastName}`,
        destination: travel.destination,
        departureDate: travel.departureDate,
        travelId: travel.id,
        appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      },
    });
  }
}

/**
 * Alert: Payments due soon (3 days before departure with pending balance)
 */
async function checkPaymentsDueSoon() {
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
  threeDaysFromNow.setHours(0, 0, 0, 0);

  const fourDaysFromNow = new Date(threeDaysFromNow);
  fourDaysFromNow.setDate(fourDaysFromNow.getDate() + 1);

  const travels = await prisma.travel.findMany({
    where: {
      departureDate: {
        gte: threeDaysFromNow,
        lt: fourDaysFromNow,
      },
      status: {
        in: ['aguardando_pagamento', 'confirmada'],
      },
    },
    include: {
      customer: true,
      agent: true,
    },
  });

  console.log(`[Alerts] Checking ${travels.length} travels for payment due soon`);

  for (const travel of travels) {
    const balance = Number(travel.totalValue) - Number(travel.paidValue);

    if (balance > 0) {
      // Create in-app notification
      await createNotification({
        type: 'warning',
        priority: 'high',
        title: 'Pagamento pendente',
        message: `Viagem de ${`${travel.customer.firstName} ${travel.customer.lastName}`} parte em 3 dias. Saldo: ${balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
        actionUrl: `/dashboard/travels/${travel.id}`,
        userId: travel.agentId,
        relatedEntity: 'travel',
        relatedEntityId: travel.id,
      });

      // Queue email
      await queueEmail({
        templateType: 'payment_due_soon',
        userId: travel.agentId,
        variables: {
          agentName: `${travel.agent.firstName} ${travel.agent.lastName}`,
          customerName: `${travel.customer.firstName} ${travel.customer.lastName}`,
          destination: travel.destination,
          departureDate: travel.departureDate,
          balance: balance,
          travelId: travel.id,
          appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        },
      });
    }
  }
}

/**
 * Alert: Overdue payments (departure date passed with pending balance)
 */
async function checkOverduePayments() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const travels = await prisma.travel.findMany({
    where: {
      departureDate: {
        lt: today,
      },
      status: {
        notIn: ['finalizada', 'cancelada'],
      },
    },
    include: {
      customer: true,
      agent: true,
    },
  });

  console.log(`[Alerts] Checking ${travels.length} travels for overdue payments`);

  for (const travel of travels) {
    const balance = Number(travel.totalValue) - Number(travel.paidValue);

    if (balance > 0) {
      // Create in-app notification
      await createNotification({
        type: 'error',
        priority: 'urgent',
        title: 'Pagamento atrasado',
        message: `Viagem de ${`${travel.customer.firstName} ${travel.customer.lastName}`} está com saldo devedor: ${balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
        actionUrl: `/dashboard/travels/${travel.id}`,
        userId: travel.agentId,
        relatedEntity: 'travel',
        relatedEntityId: travel.id,
      });

      // Queue email
      await queueEmail({
        templateType: 'payment_overdue',
        userId: travel.agentId,
        variables: {
          agentName: `${travel.agent.firstName} ${travel.agent.lastName}`,
          customerName: `${travel.customer.firstName} ${travel.customer.lastName}`,
          destination: travel.destination,
          balance: balance,
          travelId: travel.id,
          appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        },
      });
    }
  }
}
