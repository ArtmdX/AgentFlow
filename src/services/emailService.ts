import resend, { FROM_EMAIL } from '@/lib/email/resend';
import {
  SendEmailInput,
  SendEmailResponse,
  CreateEmailLogInput,
  QueueEmailInput,
  EmailTemplateVariables,
  EmailTemplateType,
} from '@/types/email';
import prisma from '@/lib/prisma';
import { shouldSendEmail } from './notificationService';

// ========================================
// Email Sending
// ========================================

/**
 * Send email via Resend
 */
export async function sendEmail(input: SendEmailInput): Promise<SendEmailResponse> {
  const { to, cc, bcc, subject, html, text } = input;

  try {
    const response = await resend.emails.send({
      from: FROM_EMAIL,
      to: Array.isArray(to) ? to : [to],
      cc: cc ? (Array.isArray(cc) ? cc : [cc]) : undefined,
      bcc: bcc ? (Array.isArray(bcc) ? bcc : [bcc]) : undefined,
      subject,
      html,
      text,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response.data as SendEmailResponse;
  } catch (error: any) {
    console.error('Error sending email:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

/**
 * Queue an email for sending
 */
export async function queueEmail(input: QueueEmailInput): Promise<any> {
  const {
    templateType,
    to: explicitTo,
    userId,
    variables = {},
    relatedEntity,
    relatedEntityId,
    maxAttempts = 3,
  } = input;

  // Determine recipient email
  let to = explicitTo;

  // If no explicit recipient, fetch user email
  if (!to && userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (!user) {
      throw new Error(`User ${userId} not found`);
    }

    to = user.email;
  }

  if (!to) {
    throw new Error('Email recipient is required');
  }

  // Check user preferences if userId provided
  if (userId) {
    const eventType = templateTypeToEventType(templateType);
    if (eventType) {
      const shouldSend = await shouldSendEmail(userId, eventType as any);
      if (!shouldSend) {
        console.log(`Email sending disabled for user ${userId} and event ${eventType}`);
        return null;
      }
    }
  }

  // Get template
  const template = await prisma.emailTemplate.findUnique({
    where: { type: templateType },
  });

  if (!template || !template.isActive) {
    console.warn(`Email template ${templateType} not found or inactive`);
    return null;
  }

  // Render template with variables
  const { subject, html, text } = renderTemplate(template, variables);

  // Create queue entry
  const queueEntry = await prisma.emailQueue.create({
    data: {
      templateType,
      to,
      subject,
      htmlContent: html,
      textContent: text,
      userId,
      relatedEntity,
      relatedEntityId,
      variables,
      maxAttempts,
    },
  });

  return queueEntry;
}

/**
 * Create email log
 */
export async function createEmailLog(input: CreateEmailLogInput) {
  return await prisma.emailLog.create({
    data: input,
  });
}

// ========================================
// Email Queue Management
// ========================================

/**
 * Get pending emails from queue
 */
export async function getPendingEmails(limit: number = 10) {
  const now = new Date();

  return await prisma.emailQueue.findMany({
    where: {
      status: 'pending',
      attempts: {
        lt: prisma.emailQueue.fields.maxAttempts,
      },
      OR: [
        { nextAttemptAt: null },
        { nextAttemptAt: { lte: now } },
      ],
    },
    take: limit,
    orderBy: { createdAt: 'asc' },
  });
}

/**
 * Update email queue entry
 */
export async function updateEmailQueue(
  id: string,
  data: {
    status?: any;
    attempts?: number;
    nextAttemptAt?: Date | null;
    processedAt?: Date | null;
    errorMessage?: string | null;
    emailLogId?: string | null;
  }
) {
  return await prisma.emailQueue.update({
    where: { id },
    data,
  });
}

// ========================================
// Template Rendering
// ========================================

/**
 * Render email template with variables
 */
function renderTemplate(
  template: { subject: string; htmlContent: string; textContent: string | null },
  variables: EmailTemplateVariables
): { subject: string; html: string; text: string } {
  // Add app URL to variables
  const vars = {
    ...variables,
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  };

  // Replace variables in subject
  let subject = template.subject;
  Object.entries(vars).forEach(([key, value]) => {
    const regex = new RegExp(`{${key}}`, 'g');
    subject = subject.replace(regex, String(value || ''));
  });

  // Replace variables in HTML content
  let html = template.htmlContent;
  Object.entries(vars).forEach(([key, value]) => {
    const regex = new RegExp(`{${key}}`, 'g');
    let replacement = '';

    if (value instanceof Date) {
      replacement = new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }).format(value);
    } else if (typeof value === 'number' && key.includes('amount')) {
      // Format currency
      const currency = vars.currency as string || 'BRL';
      replacement = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency,
      }).format(value);
    } else {
      replacement = String(value || '');
    }

    html = html.replace(regex, replacement);
  });

  // Replace variables in text content
  let text = template.textContent || '';
  Object.entries(vars).forEach(([key, value]) => {
    const regex = new RegExp(`{${key}}`, 'g');
    let replacement = '';

    if (value instanceof Date) {
      replacement = new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }).format(value);
    } else if (typeof value === 'number' && key.includes('amount')) {
      const currency = vars.currency as string || 'BRL';
      replacement = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency,
      }).format(value);
    } else {
      replacement = String(value || '');
    }

    text = text.replace(regex, replacement);
  });

  return { subject, html, text };
}

// ========================================
// Helper Functions
// ========================================

/**
 * Map template type to event type
 */
function templateTypeToEventType(templateType: EmailTemplateType): string | null {
  const map: Record<EmailTemplateType, string> = {
    travel_created: 'travel_created',
    payment_received: 'payment_received',
    travel_upcoming: 'travel_upcoming',
    payment_due_soon: 'payment_due_soon',
    payment_overdue: 'payment_overdue',
    documents_pending: 'documents_pending',
    user_welcome: 'user_welcome',
    password_reset: 'password_reset',
  };

  return map[templateType] || null;
}
