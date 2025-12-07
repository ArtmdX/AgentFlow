'use client';

/**
 * NotificationSettingsForm Component
 * Form for global notification settings
 */

import { Bell } from 'lucide-react';

interface NotificationSettingsFormProps {
  data: any;
  onChange: (field: string, value: any) => void;
}

export default function NotificationSettingsForm({ data, onChange }: NotificationSettingsFormProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b">
        <Bell className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Notificações</h3>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <p className="font-medium mb-1">Informação</p>
        <p>
          Configure as opções globais de notificações do sistema. Usuários individuais
          ainda podem personalizar suas próprias preferências.
        </p>
      </div>

      {/* Notifications Enabled */}
      <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
        <input
          type="checkbox"
          id="notificationsEnabled"
          checked={data.notificationsEnabled ?? true}
          onChange={(e) => onChange('notificationsEnabled', e.target.checked)}
          className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary mt-0.5"
        />
        <div className="flex-1">
          <label htmlFor="notificationsEnabled" className="block text-sm font-semibold text-gray-700 mb-1">
            Habilitar Notificações In-App
          </label>
          <p className="text-sm text-gray-600">
            Permite que o sistema envie notificações dentro da aplicação (central de notificações).
            Se desabilitado, nenhum usuário receberá notificações in-app.
          </p>
        </div>
      </div>

      {/* Email Notifications Enabled */}
      <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
        <input
          type="checkbox"
          id="emailNotificationsEnabled"
          checked={data.emailNotificationsEnabled ?? true}
          onChange={(e) => onChange('emailNotificationsEnabled', e.target.checked)}
          className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary mt-0.5"
        />
        <div className="flex-1">
          <label htmlFor="emailNotificationsEnabled" className="block text-sm font-semibold text-gray-700 mb-1">
            Habilitar Notificações por Email
          </label>
          <p className="text-sm text-gray-600">
            Permite que o sistema envie notificações por email para os usuários.
            Se desabilitado, nenhum email de notificação será enviado.
          </p>
          {data.emailNotificationsEnabled && (
            <p className="text-sm text-yellow-600 mt-2">
              Certifique-se de configurar o SMTP corretamente na aba &quot;Email&quot; para que
              as notificações por email funcionem.
            </p>
          )}
        </div>
      </div>

      {/* Information Box */}
      <div className="pt-4 border-t">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">
          Tipos de Notificações Disponíveis
        </h4>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
            <p><strong>Viagens:</strong> Criação, alteração de status, viagens próximas</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
            <p><strong>Pagamentos:</strong> Pagamento recebido, vencimento próximo, atraso</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
            <p><strong>Documentos:</strong> Documentos pendentes, expiração próxima</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
            <p><strong>Sistema:</strong> Atualizações, manutenções, alertas importantes</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700">
        <p className="font-medium mb-1">Preferências Individuais</p>
        <p>
          Cada usuário pode personalizar suas próprias preferências de notificação em
          <strong className="text-primary"> Perfil → Notificações</strong>.
          As configurações globais apenas determinam se o recurso está disponível.
        </p>
      </div>
    </div>
  );
}
