import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { hasPermission, Permission } from '@/lib/permissions';
import { auditFiltersSchema } from '@/lib/validations';
import { activity_type } from '@prisma/client';

/**
 * GET /api/reports/audit
 * Retorna lista de atividades (audit log) com filtros e paginação
 * Permissão: Admin apenas
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Verificar permissão
    if (!hasPermission(session as any, Permission.VIEW_AUDIT_LOG)) {
      return NextResponse.json(
        { error: 'Sem permissão para visualizar log de auditoria' },
        { status: 403 }
      );
    }

    // Obter query params
    const searchParams = request.nextUrl.searchParams;
    const queryParams = {
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      userId: searchParams.get('userId') || undefined,
      activityType: searchParams.get('activityType') || undefined,
      entityType: searchParams.get('entityType') || undefined,
      search: searchParams.get('search') || undefined,
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '50',
    };

    // Validar filtros
    const filters = auditFiltersSchema.parse(queryParams);

    // Construir WHERE clause
    const where: any = {};

    // Filtro por data
    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        // Adicionar 23:59:59 para incluir o dia completo
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);
        where.createdAt.lte = endDate;
      }
    }

    // Filtro por usuário
    if (filters.userId) {
      where.userId = filters.userId;
    }

    // Filtro por tipo de atividade
    if (filters.activityType) {
      where.activityType = filters.activityType as activity_type;
    }

    // Filtro por tipo de entidade
    if (filters.entityType) {
      if (filters.entityType === 'travel') {
        where.travelId = { not: null };
      } else if (filters.entityType === 'customer') {
        where.customerId = { not: null };
        where.travelId = null;
      } else if (filters.entityType === 'payment') {
        where.title = { contains: 'pagamento', mode: 'insensitive' as any };
      }
    }

    // Filtro por busca textual (título ou descrição)
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' as any } },
        { description: { contains: filters.search, mode: 'insensitive' as any } },
      ];
    }

    // Calcular paginação
    const skip = (filters.page - 1) * filters.limit;

    // Buscar atividades
    const [activities, totalCount] = await Promise.all([
      prisma.activity.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          travel: {
            select: {
              id: true,
              title: true,
              destination: true,
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
        take: filters.limit,
      }),
      prisma.activity.count({ where }),
    ]);

    // Calcular estatísticas
    const stats = await prisma.activity.groupBy({
      by: ['activityType'],
      where,
      _count: {
        id: true,
      },
    });

    const statsByUser = await prisma.activity.groupBy({
      by: ['userId'],
      where,
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 10,
    });

    // Buscar nomes dos usuários para as estatísticas
    const userIds = statsByUser.map(s => s.userId);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, firstName: true, lastName: true },
    });

    const userMap = new Map(users.map(u => [u.id, `${u.firstName} ${u.lastName}`]));

    // Formatar resposta
    const totalPages = Math.ceil(totalCount / filters.limit);

    return NextResponse.json({
      success: true,
      data: {
        activities: activities.map(activity => ({
          ...activity,
          createdAt: activity.createdAt?.toISOString(),
        })),
        pagination: {
          page: filters.page,
          limit: filters.limit,
          totalCount,
          totalPages,
          hasNextPage: filters.page < totalPages,
          hasPreviousPage: filters.page > 1,
        },
        statistics: {
          total: totalCount,
          byType: stats.map(s => ({
            type: s.activityType,
            count: s._count.id,
          })),
          byUser: statsByUser.map(s => ({
            userId: s.userId,
            userName: userMap.get(s.userId) || 'Desconhecido',
            count: s._count.id,
          })),
        },
      },
    });

  } catch (error) {
    console.error('[AUDIT API] Error:', error);

    // Erro de validação Zod
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Parâmetros inválidos', details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erro ao buscar log de auditoria' },
      { status: 500 }
    );
  }
}
