import prisma from '@/lib/prisma';
import { sendEmail, createEmailLog } from './emailService';
import { EmailStatus, QueueStatus } from '@prisma/client';

/**
 * Process email queue - sends pending emails with retry logic
 */
export async function processEmailQueue() {
  const now = new Date();

  // Get pending emails ready to send
  const pendingEmails = await prisma.emailQueue.findMany({
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
    take: 10, // Process 10 at a time to avoid overwhelming the email service
    orderBy: { createdAt: 'asc' },
  });

  console.log(`[EmailQueue] Processing ${pendingEmails.length} emails...`);

  for (const email of pendingEmails) {
    await processEmail(email);
  }

  return pendingEmails.length;
}

/**
 * Process a single email from the queue
 */
async function processEmail(email: any) {
  try {
    // Mark as processing
    await prisma.emailQueue.update({
      where: { id: email.id },
      data: {
        status: 'processing' as QueueStatus,
        attempts: email.attempts + 1,
      },
    });

    console.log(`[EmailQueue] Sending email ${email.id} (attempt ${email.attempts + 1}/${email.maxAttempts})`);

    // Send email via Resend
    const result = await sendEmail({
      to: email.to,
      subject: email.subject,
      html: email.htmlContent,
      text: email.textContent || undefined,
    });

    console.log(`[EmailQueue] Email ${email.id} sent successfully. Resend ID: ${result.id}`);

    // Create success log
    const emailLog = await createEmailLog({
      templateType: email.templateType,
      subject: email.subject,
      to: email.to,
      from: process.env.FROM_EMAIL || 'noreply@agentflow.com',
      status: 'sent' as EmailStatus,
      sentAt: new Date(),
      resendId: result.id,
      userId: email.userId,
      relatedEntity: email.relatedEntity,
      relatedEntityId: email.relatedEntityId,
    });

    // Mark queue item as completed
    await prisma.emailQueue.update({
      where: { id: email.id },
      data: {
        status: 'completed' as QueueStatus,
        processedAt: new Date(),
        emailLogId: emailLog.id,
      },
    });
  } catch (error: any) {
    console.error(`[EmailQueue] Error sending email ${email.id}:`, error);

    const currentAttempt = email.attempts + 1;
    const maxReached = currentAttempt >= email.maxAttempts;

    if (maxReached) {
      // Max attempts reached - mark as failed
      console.error(`[EmailQueue] Email ${email.id} failed after ${currentAttempt} attempts`);

      await prisma.emailQueue.update({
        where: { id: email.id },
        data: {
          status: 'failed' as QueueStatus,
          errorMessage: error.message,
          processedAt: new Date(),
        },
      });

      // Create failure log
      await createEmailLog({
        templateType: email.templateType,
        subject: email.subject,
        to: email.to,
        from: process.env.FROM_EMAIL || 'noreply@agentflow.com',
        status: 'failed' as EmailStatus,
        failedAt: new Date(),
        errorMessage: error.message,
        userId: email.userId,
        relatedEntity: email.relatedEntity,
        relatedEntityId: email.relatedEntityId,
      });
    } else {
      // Calculate next retry with exponential backoff
      // 1st retry: 5 min, 2nd retry: 10 min, 3rd retry: 20 min
      const backoffMinutes = Math.pow(2, currentAttempt - 1) * 5;
      const nextAttemptAt = new Date(Date.now() + backoffMinutes * 60000);

      console.log(`[EmailQueue] Email ${email.id} will retry in ${backoffMinutes} minutes (attempt ${currentAttempt}/${email.maxAttempts})`);

      // Schedule retry
      await prisma.emailQueue.update({
        where: { id: email.id },
        data: {
          status: 'pending' as QueueStatus,
          nextAttemptAt,
          errorMessage: error.message,
        },
      });
    }
  }
}

/**
 * Get queue statistics
 */
export async function getQueueStats() {
  const [pending, processing, completed, failed] = await Promise.all([
    prisma.emailQueue.count({ where: { status: 'pending' } }),
    prisma.emailQueue.count({ where: { status: 'processing' } }),
    prisma.emailQueue.count({ where: { status: 'completed' } }),
    prisma.emailQueue.count({ where: { status: 'failed' } }),
  ]);

  return { pending, processing, completed, failed };
}

/**
 * Clean old completed queue entries (older than 30 days)
 */
export async function cleanOldQueueEntries() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const result = await prisma.emailQueue.deleteMany({
    where: {
      status: { in: ['completed' as QueueStatus, 'cancelled' as QueueStatus] },
      processedAt: {
        lt: thirtyDaysAgo,
      },
    },
  });

  console.log(`[EmailQueue] Cleaned ${result.count} old queue entries`);
  return result.count;
}
