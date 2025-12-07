import { Resend } from 'resend';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Default sender email
export const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@agentflow.com';

export default resend;
