import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { hasPermission, Permission } from '@/lib/permissions';
import type { SessionWithRole } from '@/lib/permissions';
import { queueEmail } from '@/services/notificationService';
import { z } from 'zod';

// Validation schema
const testEmailSchema = z.object({
  to: z.string().email('Email inválido'),
  templateType: z.enum([
    'travel_created',
    'payment_received',
    'travel_upcoming',
    'payment_due_soon',
    'payment_overdue',
    'documents_pending',
  ]),
  testData: z.record(z.any()).optional(),
});

/**
 * POST /api/emails/test
 * Send a test email (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permission
    if (!hasPermission(session as SessionWithRole, Permission.VIEW_EMAIL_LOGS)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Parse and validate body
    const body = await request.json();
    const validation = testEmailSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { to, templateType, testData } = validation.data;

    // Default test data based on template type
    const defaultTestData: Record<string, any> = {
      travel_created: {
        agentName: 'Agente Teste',
        customerName: 'Cliente Teste',
        destination: 'Paris, França',
        departureDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        travelId: 'test-travel-id',
        appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      },
      payment_received: {
        agentName: 'Agente Teste',
        customerName: 'Cliente Teste',
        amount: '5000',
        currency: 'BRL',
        paymentMethod: 'PIX',
        travelId: 'test-travel-id',
        appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      },
      travel_upcoming: {
        agentName: 'Agente Teste',
        customerName: 'Cliente Teste',
        destination: 'Roma, Itália',
        departureDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        travelId: 'test-travel-id',
        appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      },
      payment_due_soon: {
        agentName: 'Agente Teste',
        customerName: 'Cliente Teste',
        destination: 'Londres, Reino Unido',
        departureDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        balance: '3500',
        travelId: 'test-travel-id',
        appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      },
      payment_overdue: {
        agentName: 'Agente Teste',
        customerName: 'Cliente Teste',
        destination: 'Tóquio, Japão',
        balance: '8000',
        travelId: 'test-travel-id',
        appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      },
      documents_pending: {
        agentName: 'Agente Teste',
        customerName: 'Cliente Teste',
        destination: 'Nova York, EUA',
        documents: ['Passaporte', 'Visto', 'Comprovante de vacinação'],
        travelId: 'test-travel-id',
        appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      },
    };

    // Merge default data with custom test data
    const variables = {
      ...defaultTestData[templateType],
      ...testData,
      to, // Override recipient
    };

    // Queue the test email (not associated with a user)
    const emailLog = await queueEmail({
      templateType,
      userId: session.user.id, // Log who sent the test email
      variables,
      to, // Explicit recipient override
    });

    return NextResponse.json({
      success: true,
      message: 'Test email queued successfully',
      emailLogId: emailLog.id,
    });
  } catch (error) {
    console.error('Error sending test email:', error);
    return NextResponse.json(
      { error: 'Failed to send test email' },
      { status: 500 }
    );
  }
}
