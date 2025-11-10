import prisma from '@/lib/prisma';
import { activity_type } from '@prisma/client';

export interface CreateActivityParams {
  userId: string;
  travelId?: string | null;
  customerId?: string | null;
  type: activity_type;
  title: string;
  description?: string | null;
  metadata?: Record<string, unknown> | null;
}

export interface ActivityFilters {
  travelId?: string;
  customerId?: string;
  userId?: string;
  type?: activity_type;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

/**
 * Cria uma nova atividade no log de auditoria
 */
export async function createActivity(params: CreateActivityParams) {
  const { userId, travelId, customerId, type, title, description, metadata } = params;

  return await prisma.activity.create({
    data: {
      userId,
      travelId: travelId || undefined,
      customerId: customerId || undefined,
      activityType: type,
      title,
      description: description || undefined,
      metadata: metadata || undefined,
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
}

/**
 * Busca atividades com filtros e paginação
 */
export async function getActivities(filters: ActivityFilters) {
  const {
    travelId,
    customerId,
    userId,
    type,
    startDate,
    endDate,
    page = 1,
    limit = 50,
  } = filters;

  const where: {
    travelId?: string;
    customerId?: string;
    userId?: string;
    activityType?: activity_type;
    createdAt?: {
      gte?: Date;
      lte?: Date;
    };
  } = {};

  if (travelId) where.travelId = travelId;
  if (customerId) where.customerId = customerId;
  if (userId) where.userId = userId;
  if (type) where.activityType = type;

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = startDate;
    if (endDate) where.createdAt.lte = endDate;
  }

  const skip = (page - 1) * limit;

  const [activities, total] = await Promise.all([
    prisma.activity.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        travel: {
          select: {
            id: true,
            title: true,
          },
        },
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    }),
    prisma.activity.count({ where }),
  ]);

  return {
    activities,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Busca atividades de uma viagem específica
 */
export async function getActivitiesByTravel(travelId: string, limit: number = 50) {
  return await prisma.activity.findMany({
    where: { travelId },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  });
}

/**
 * Busca atividades de um cliente específico
 */
export async function getActivitiesByCustomer(customerId: string, limit: number = 50) {
  return await prisma.activity.findMany({
    where: { customerId },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      travel: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  });
}

/**
 * Helper: Log de criação de viagem
 */
export async function logTravelCreated(userId: string, travelId: string, travelTitle: string) {
  return await createActivity({
    userId,
    travelId,
    type: 'created',
    title: 'Viagem criada',
    description: `A viagem "${travelTitle}" foi criada`,
  });
}

/**
 * Helper: Log de atualização de viagem
 */
export async function logTravelUpdated(
  userId: string,
  travelId: string,
  travelTitle: string,
  changes: Record<string, unknown>
) {
  const changedFields = Object.keys(changes).join(', ');

  return await createActivity({
    userId,
    travelId,
    type: 'updated',
    title: 'Viagem atualizada',
    description: `Campos alterados: ${changedFields}`,
    metadata: { changes },
  });
}

/**
 * Helper: Log de mudança de status de viagem
 */
export async function logTravelStatusChange(
  userId: string,
  travelId: string,
  travelTitle: string,
  oldStatus: string,
  newStatus: string
) {
  return await createActivity({
    userId,
    travelId,
    type: 'status_change',
    title: 'Status da viagem alterado',
    description: `Status mudou de "${oldStatus}" para "${newStatus}"`,
    metadata: { oldStatus, newStatus },
  });
}

/**
 * Helper: Log de pagamento
 */
export async function logPayment(
  userId: string,
  travelId: string,
  amount: number,
  currency: string,
  paymentMethod: string
) {
  return await createActivity({
    userId,
    travelId,
    type: 'payment',
    title: 'Pagamento registrado',
    description: `Pagamento de ${currency} ${amount} via ${paymentMethod}`,
    metadata: { amount, currency, paymentMethod },
  });
}

/**
 * Helper: Log de criação de cliente
 */
export async function logCustomerCreated(
  userId: string,
  customerId: string,
  customerName: string
) {
  return await createActivity({
    userId,
    customerId,
    type: 'created',
    title: 'Cliente criado',
    description: `O cliente "${customerName}" foi cadastrado`,
  });
}

/**
 * Helper: Log de atualização de cliente
 */
export async function logCustomerUpdated(
  userId: string,
  customerId: string,
  customerName: string,
  changes: Record<string, unknown>
) {
  const changedFields = Object.keys(changes).join(', ');

  return await createActivity({
    userId,
    customerId,
    type: 'updated',
    title: 'Cliente atualizado',
    description: `Campos alterados: ${changedFields}`,
    metadata: { changes },
  });
}

/**
 * Helper: Log de nota/contato
 */
export async function logNote(
  userId: string,
  note: string,
  travelId?: string,
  customerId?: string
) {
  return await createActivity({
    userId,
    travelId: travelId || null,
    customerId: customerId || null,
    type: 'note',
    title: 'Nota adicionada',
    description: note,
  });
}

/**
 * Helper: Log de contato com cliente
 */
export async function logContact(
  userId: string,
  customerId: string,
  contactType: string,
  notes: string
) {
  return await createActivity({
    userId,
    customerId,
    type: 'contact',
    title: `Contato via ${contactType}`,
    description: notes,
    metadata: { contactType },
  });
}
