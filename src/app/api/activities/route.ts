import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { handleAPIError } from '@/lib/error-handler';
import { AuthenticationError } from '@/lib/errors';
import { getActivities, createActivity } from '@/services/activityService';
import { activity_type } from '@prisma/client';

// GET - Listar atividades com filtros
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      throw new AuthenticationError('Você precisa estar autenticado para acessar esta página');
    }

    const { searchParams } = new URL(request.url);

    // Extrair filtros
    const filters = {
      travelId: searchParams.get('travelId') || undefined,
      customerId: searchParams.get('customerId') || undefined,
      userId: searchParams.get('userId') || undefined,
      type: (searchParams.get('type') as activity_type) || undefined,
      startDate: searchParams.get('startDate')
        ? new Date(searchParams.get('startDate')!)
        : undefined,
      endDate: searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined,
      page: parseInt(searchParams.get('page') || '1', 10),
      limit: parseInt(searchParams.get('limit') || '50', 10),
    };

    const result = await getActivities(filters);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return handleAPIError(error);
  }
}

// POST - Criar atividade manual
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      throw new AuthenticationError('Você precisa estar autenticado para criar uma atividade');
    }

    const userId = session.user.id;
    const body = await request.json();

    // Validar campos obrigatórios
    if (!body.type || !body.title) {
      return NextResponse.json(
        { message: 'Tipo e título são obrigatórios' },
        { status: 400 }
      );
    }

    // Criar atividade
    const activity = await createActivity({
      userId,
      travelId: body.travelId || null,
      customerId: body.customerId || null,
      type: body.type as activity_type,
      title: body.title,
      description: body.description || null,
      metadata: body.metadata || null,
    });

    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    return handleAPIError(error);
  }
}
