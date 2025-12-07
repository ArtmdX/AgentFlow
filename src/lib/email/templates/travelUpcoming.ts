import { EmailTemplateVariables, RenderedEmail } from '@/types/email';

export function renderTravelUpcomingEmail(variables: EmailTemplateVariables): RenderedEmail {
  const { agentName, customerName, destination, departureDate, travelId, appUrl } = variables;

  const formattedDate = departureDate
    ? new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(departureDate))
    : 'Data não definida';

  const subject = `Lembrete: Viagem próxima - ${customerName}`;

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><title>${subject}</title></head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
        <tr><td style="background-color: #3B82F6; padding: 30px 40px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">🗓️ Viagem Próxima</h1>
        </td></tr>
        <tr><td style="padding: 40px;">
          <p style="color: #374151; font-size: 16px; margin: 0 0 20px 0;">Olá ${agentName},</p>
          <p style="color: #374151; font-size: 16px; margin: 0 0 30px 0;">
            A viagem de <strong>${customerName}</strong> para <strong>${destination}</strong> parte em 7 dias.
          </p>
          <table width="100%" cellpadding="12" cellspacing="0" style="background-color: #FEF3C7; border-radius: 8px; margin-bottom: 30px;">
            <tr><td style="color: #92400E; font-size: 14px; padding: 15px 20px; text-align: center;">
              <strong>Data de Partida: ${formattedDate}</strong>
            </td></tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center">
              <a href="${appUrl}/dashboard/travels/${travelId}" style="display: inline-block; background-color: #3B82F6; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 16px;">
                Ver Detalhes
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
Lembrete: Viagem Próxima

Olá ${agentName},

A viagem de ${customerName} para ${destination} parte em 7 dias.
Data de Partida: ${formattedDate}

Ver detalhes: ${appUrl}/dashboard/travels/${travelId}
  `.trim();

  return { subject, html, text };
}
