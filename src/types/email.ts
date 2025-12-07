import { EmailLog, EmailTemplate, EmailQueue, EmailStatus, QueueStatus } from '@prisma/client';

// ========================================
// Email Types
// ========================================

export type { EmailLog, EmailTemplate, EmailQueue, EmailStatus, QueueStatus };

// ========================================
// Email Template Types
// ========================================

export type EmailTemplateType =
  | 'travel_created'
  | 'payment_received'
  | 'travel_upcoming'
  | 'payment_due_soon'
  | 'payment_overdue'
  | 'documents_pending'
  | 'user_welcome'
  | 'password_reset';

export interface EmailTemplateVariables {
  // Common variables
  userName?: string;
  userEmail?: string;
  appUrl?: string;

  // Travel variables
  customerName?: string;
  destination?: string;
  departureDate?: Date | string;
  returnDate?: Date | string;
  travelId?: string;
  travelTitle?: string;

  // Payment variables
  amount?: number;
  currency?: string;
  paymentMethod?: string;
  balance?: number;
  paymentDate?: Date | string;

  // Agent variables
  agentName?: string;
  agentEmail?: string;

  // Other
  resetToken?: string;
  [key: string]: any;
}

export interface CreateEmailTemplateInput {
  type: string;
  name: string;
  description?: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  availableVars: string[];
  isActive?: boolean;
}

export interface UpdateEmailTemplateInput {
  name?: string;
  description?: string;
  subject?: string;
  htmlContent?: string;
  textContent?: string;
  availableVars?: string[];
  isActive?: boolean;
}

export interface EmailTemplatePreview {
  html: string;
  subject: string;
  text?: string;
}

// ========================================
// Email Sending Types
// ========================================

export interface SendEmailInput {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  html: string;
  text?: string;
}

export interface SendEmailResponse {
  id: string;
  from: string;
  to: string[];
  created_at: string;
}

export interface QueueEmailInput {
  templateType: EmailTemplateType;
  to?: string; // Optional - will fetch from userId if not provided
  userId?: string;
  variables?: EmailTemplateVariables;
  relatedEntity?: string;
  relatedEntityId?: string;
  maxAttempts?: number;
}

export interface CreateEmailLogInput {
  templateType: string;
  subject: string;
  to: string;
  cc?: string;
  bcc?: string;
  from: string;
  status: EmailStatus;
  sentAt?: Date;
  failedAt?: Date;
  errorMessage?: string;
  userId?: string;
  relatedEntity?: string;
  relatedEntityId?: string;
  resendId?: string;
  resendStatus?: string;
}

// ========================================
// Email Log Response Types
// ========================================

export interface EmailLogListResponse {
  logs: EmailLog[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  stats: {
    total: number;
    sent: number;
    failed: number;
    pending: number;
  };
}

export interface EmailStatsResponse {
  last24h: {
    sent: number;
    failed: number;
  };
  last7days: {
    sent: number;
    failed: number;
  };
  last30days: {
    sent: number;
    failed: number;
  };
  byTemplate: Record<string, number>;
  deliveryRate: number;
}

// ========================================
// Email Queue Types
// ========================================

export interface CreateEmailQueueInput {
  templateType: string;
  to: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  userId?: string;
  relatedEntity?: string;
  relatedEntityId?: string;
  variables?: EmailTemplateVariables;
  maxAttempts?: number;
}

export interface UpdateEmailQueueInput {
  status?: QueueStatus;
  attempts?: number;
  nextAttemptAt?: Date | null;
  processedAt?: Date | null;
  errorMessage?: string | null;
  emailLogId?: string | null;
}

// ========================================
// Rendered Email Types
// ========================================

export interface RenderedEmail {
  subject: string;
  html: string;
  text?: string;
}
