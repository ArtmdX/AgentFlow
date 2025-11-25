import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not defined in environment variables");
}

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || "onboarding@resend.dev";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const APP_NAME = "AgentFlow";

interface SendPasswordResetEmailParams {
  to: string;
  userName: string;
  resetToken: string;
}

/**
 * Sends a password reset email to the user
 */
export async function sendPasswordResetEmail({ to, userName, resetToken }: SendPasswordResetEmailParams) {
  const resetUrl = `${APP_URL}/auth/reset-password?token=${resetToken}`;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `${APP_NAME} - Recuperação de Senha`,
      html: getPasswordResetEmailTemplate({
        userName,
        resetUrl,
      }),
    });

    console.log("Password reset email sent:", data);
    if (error) {
      console.error("Error sending password reset email:", error);
      throw new Error("Failed to send password reset email");
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error in sendPasswordResetEmail:", error);
    throw error;
  }
}

/**
 * HTML template for password reset email
 */
function getPasswordResetEmailTemplate({ userName, resetUrl }: { userName: string; resetUrl: string }) {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recuperação de Senha - ${APP_NAME}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f3f4f6;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">

          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">${APP_NAME}</h1>
              <p style="margin: 8px 0 0; color: #E0E7FF; font-size: 14px;">Sistema de Gestão para Agências de Viagem</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 16px; color: #111827; font-size: 24px; font-weight: 600;">Recuperação de Senha</h2>

              <p style="margin: 0 0 16px; color: #4B5563; font-size: 16px; line-height: 1.6;">
                Olá <strong style="color: #111827;">${userName}</strong>,
              </p>

              <p style="margin: 0 0 24px; color: #4B5563; font-size: 16px; line-height: 1.6;">
                Recebemos uma solicitação para redefinir a senha da sua conta no <strong>${APP_NAME}</strong>.
                Clique no botão abaixo para criar uma nova senha:
              </p>

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0 0 24px;">
                <tr>
                  <td align="center">
                    <a href="${resetUrl}"
                       style="display: inline-block; padding: 14px 40px; background-color: #3B82F6; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);">
                      Redefinir Senha
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 16px; color: #4B5563; font-size: 14px; line-height: 1.6;">
                Se o botão não funcionar, copie e cole o seguinte link no seu navegador:
              </p>

              <div style="margin: 0 0 24px; padding: 12px; background-color: #F3F4F6; border-radius: 6px; word-break: break-all;">
                <a href="${resetUrl}" style="color: #3B82F6; font-size: 14px; text-decoration: none;">
                  ${resetUrl}
                </a>
              </div>

              <!-- Warning Box -->
              <div style="margin: 0 0 24px; padding: 16px; background-color: #FEF3C7; border-left: 4px solid #F59E0B; border-radius: 4px;">
                <p style="margin: 0 0 8px; color: #92400E; font-size: 14px; font-weight: 600;">
                  ⚠️ Importante:
                </p>
                <ul style="margin: 0; padding-left: 20px; color: #92400E; font-size: 14px; line-height: 1.6;">
                  <li>Este link expira em <strong>1 hora</strong></li>
                  <li>Por segurança, não compartilhe este email com ninguém</li>
                  <li>Se você não solicitou esta recuperação, ignore este email</li>
                </ul>
              </div>

              <p style="margin: 0; color: #6B7280; font-size: 14px; line-height: 1.6;">
                Se você tiver qualquer dúvida ou precisar de ajuda, entre em contato com nossa equipe de suporte.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #F9FAFB; border-radius: 0 0 8px 8px; border-top: 1px solid #E5E7EB;">
              <p style="margin: 0 0 8px; color: #6B7280; font-size: 12px; text-align: center;">
                Este é um email automático, por favor não responda.
              </p>
              <p style="margin: 0; color: #9CA3AF; font-size: 12px; text-align: center;">
                © ${new Date().getFullYear()} ${APP_NAME}. Todos os direitos reservados.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
