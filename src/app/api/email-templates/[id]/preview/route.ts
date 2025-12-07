import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { hasPermission, Permission } from '@/lib/permissions';
import type { SessionWithRole } from '@/lib/permissions';

/**
 * POST /api/email-templates/[id]/preview
 * Preview email template with test data (admin only)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.role) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission(session as SessionWithRole, Permission.VIEW_EMAIL_TEMPLATES)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get template
    const template = await prisma.emailTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    // Parse test variables from request body
    const body = await request.json();
    const variables = body.variables || {};

    // Add default values for common variables
    const testVariables = {
      agentName: 'João Silva',
      customerName: 'Maria Santos',
      destination: 'Paris, França',
      departureDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      amount: '5000',
      balance: '2500',
      currency: 'BRL',
      paymentMethod: 'PIX',
      travelId: 'preview-travel-id',
      appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      documents: ['Passaporte', 'Visto', 'Comprovante de vacinação'],
      ...variables,
    };

    // Replace variables in subject
    let subject = template.subject;
    Object.entries(testVariables).forEach(([key, value]) => {
      const regex = new RegExp(`{${key}}`, 'g');
      subject = subject.replace(regex, String(value || ''));
    });

    // Replace variables in HTML content
    let html = template.htmlContent;
    Object.entries(testVariables).forEach(([key, value]) => {
      const regex = new RegExp(`{${key}}`, 'g');
      let replacement = '';

      if (value instanceof Date) {
        replacement = new Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }).format(value);
      } else if (typeof value === 'number' || (typeof value === 'string' && !isNaN(Number(value)))) {
        // Format currency if it looks like an amount
        if (key.includes('amount') || key.includes('balance') || key.includes('value')) {
          const currency = testVariables.currency as string || 'BRL';
          replacement = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency,
          }).format(Number(value));
        } else {
          replacement = String(value);
        }
      } else if (Array.isArray(value)) {
        replacement = value.join(', ');
      } else {
        replacement = String(value || '');
      }

      html = html.replace(regex, replacement);
    });

    // Replace variables in text content
    let text = template.textContent || '';
    Object.entries(testVariables).forEach(([key, value]) => {
      const regex = new RegExp(`{${key}}`, 'g');
      let replacement = '';

      if (value instanceof Date) {
        replacement = new Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }).format(value);
      } else if (Array.isArray(value)) {
        replacement = value.join(', ');
      } else {
        replacement = String(value || '');
      }

      text = text.replace(regex, replacement);
    });

    return NextResponse.json({
      subject,
      html,
      text,
      variables: testVariables,
    });
  } catch (error) {
    console.error('Error previewing email template:', error);
    return NextResponse.json(
      { error: 'Failed to preview email template' },
      { status: 500 }
    );
  }
}
