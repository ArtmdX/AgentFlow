import { EmailTemplateVariables, RenderedEmail } from '@/types/email';

export function renderTravelCreatedEmail(variables: EmailTemplateVariables): RenderedEmail {
  const { customerName, destination, departureDate, travelId, appUrl } = variables;

  const formattedDate = departureDate
    ? new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }).format(new Date(departureDate))
    : 'Data não definida';

  const subject = `Nova viagem criada para ${customerName}`;

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color: #3B82F6; padding: 30px 40px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Nova Viagem Criada</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Olá,
              </p>

              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                Uma nova viagem foi criada no sistema:
              </p>

              <table width="100%" cellpadding="12" cellspacing="0" style="background-color: #F3F4F6; border-radius: 8px; margin-bottom: 30px;">
                <tr>
                  <td style="color: #6B7280; font-size: 14px; padding: 12px 20px;">
                    <strong style="color: #111827;">Cliente:</strong>
                  </td>
                  <td style="color: #374151; font-size: 16px; padding: 12px 20px;">
                    ${customerName}
                  </td>
                </tr>
                <tr>
                  <td style="color: #6B7280; font-size: 14px; padding: 12px 20px; border-top: 1px solid #E5E7EB;">
                    <strong style="color: #111827;">Destino:</strong>
                  </td>
                  <td style="color: #374151; font-size: 16px; padding: 12px 20px; border-top: 1px solid #E5E7EB;">
                    ${destination}
                  </td>
                </tr>
                <tr>
                  <td style="color: #6B7280; font-size: 14px; padding: 12px 20px; border-top: 1px solid #E5E7EB;">
                    <strong style="color: #111827;">Data de Partida:</strong>
                  </td>
                  <td style="color: #374151; font-size: 16px; padding: 12px 20px; border-top: 1px solid #E5E7EB;">
                    ${formattedDate}
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${appUrl}/dashboard/travels/${travelId}"
                       style="display: inline-block; background-color: #3B82F6; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 16px; font-weight: 600;">
                      Ver Detalhes da Viagem
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F9FAFB; padding: 20px 40px; text-align: center; border-top: 1px solid #E5E7EB;">
              <p style="color: #6B7280; font-size: 12px; margin: 0;">
                Este é um e-mail automático do AgentFlow CRM. Por favor, não responda.
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

  const text = `
Nova Viagem Criada

Uma nova viagem foi criada no sistema:
- Cliente: ${customerName}
- Destino: ${destination}
- Data de Partida: ${formattedDate}

Ver detalhes: ${appUrl}/dashboard/travels/${travelId}

---
Este é um e-mail automático do AgentFlow CRM.
  `.trim();

  return { subject, html, text };
}
