import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { hasPermission, Permission } from '@/lib/permissions';
import type { SessionWithRole } from '@/lib/permissions';
import { z } from 'zod';

// Validation schema for email template
const emailTemplateSchema = z.object({
  type: z.string().min(1, 'Template type is required'),
  name: z.string().min(1, 'Template name is required'),
  description: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  htmlContent: z.string().min(1, 'HTML content is required'),
  textContent: z.string().optional(),
  availableVars: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
});

/**
 * GET /api/email-templates
 * List all email templates (admin only)
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permission
    if (!hasPermission(session as SessionWithRole, Permission.VIEW_EMAIL_TEMPLATES)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const templates = await prisma.emailTemplate.findMany({
      orderBy: [
        { isActive: 'desc' },
        { updatedAt: 'desc' },
      ],
    });

    return NextResponse.json({ templates });
  } catch (error) {
    console.error('Error fetching email templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email templates' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/email-templates
 * Create a new email template (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check permission
    if (!hasPermission(session as SessionWithRole, Permission.UPDATE_EMAIL_TEMPLATE)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Parse and validate body
    const body = await request.json();
    const validation = emailTemplateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Check if template type already exists
    const existing = await prisma.emailTemplate.findUnique({
      where: { type: data.type },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Template type already exists' },
        { status: 409 }
      );
    }

    // Create template
    const template = await prisma.emailTemplate.create({
      data: {
        type: data.type,
        name: data.name,
        description: data.description || null,
        subject: data.subject,
        htmlContent: data.htmlContent,
        textContent: data.textContent || null,
        availableVars: data.availableVars,
        isActive: data.isActive,
      },
    });

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error('Error creating email template:', error);
    return NextResponse.json(
      { error: 'Failed to create email template' },
      { status: 500 }
    );
  }
}
