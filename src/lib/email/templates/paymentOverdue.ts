import { EmailTemplateVariables, RenderedEmail } from '@/types/email';

export function renderPaymentOverdueEmail(variables: EmailTemplateVariables): RenderedEmail {
  const { agentName, customerName, destination, balance, travelId, appUrl } = variables;

  const formattedBalance = balance
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(balance))
    : 'R$ 0,00';

  const subject = `🚨 URGENTE: Pagamento atrasado - ${customerName}`;

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><title>${subject}</title></head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
        <tr><td style="background-color: #DC2626; padding: 30px 40px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">🚨 Pagamento Atrasado</h1>
        </td></tr>
        <tr><td style="padding: 40px;">
          <p style="color: #374151; font-size: 16px; margin: 0 0 20px 0;">Olá ${agentName},</p>
          <p style="color: #374151; font-size: 16px; margin: 0 0 30px 0;">
            <strong>ATENÇÃO:</strong> A viagem de <strong>${customerName}</strong> para <strong>${destination}</strong> possui pagamento atrasado.
          </p>
          <table width="100%" cellpadding="15" cellspacing="0" style="background-color: #FEE2E2; border-radius: 8px; margin-bottom: 30px; border: 2px solid #DC2626;">
            <tr><td align="center">
              <div style="font-size: 32px; font-weight: bold; color: #DC2626;">Saldo Devedor: ${formattedBalance}</div>
            </td></tr>
          </table>
          <p style="color: #DC2626; font-size: 14px; margin: 0 0 30px 0; font-weight: 600;">⚠️ Ação imediata necessária</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center">
              <a href="${appUrl}/dashboard/travels/${travelId}" style="display: inline-block; background-color: #DC2626; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 16px; font-weight: 600;">
                Resolver Agora
              </a>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="background-color: #F9FAFB; padding: 20px; text-align: center; border-top: 1px solid #E5E7EB;">
          <p style="color: #6B7280; font-size: 12px; margin: 0;">AgentFlow CRM - E-mail automático</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
  `.trim();

  const text = `
🚨 URGENTE: Pagamento Atrasado

Olá ${agentName},

ATENÇÃO: A viagem de ${customerName} para ${destination} possui pagamento atrasado.
Saldo Devedor: ${formattedBalance}

⚠️ Ação imediata necessária
Resolver agora: ${appUrl}/dashboard/travels/${travelId}
  `.trim();

  return { subject, html, text };
}
