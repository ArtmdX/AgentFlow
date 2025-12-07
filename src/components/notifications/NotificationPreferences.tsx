'use client';

import { useState, useEffect } from 'react';
import { Save, Bell, Mail, Clock } from 'lucide-react';
import { useNotificationPreferences, useUpdateNotificationPreferences } from '@/hooks/useNotificationPreferences';

export function NotificationPreferences() {
  const { data: preferences, isLoading } = useNotificationPreferences();
  const updatePreferences = useUpdateNotificationPreferences();
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Local state for form
  const [formData, setFormData] = useState<any>(preferences || {});

  // Update form when preferences load
  useEffect(() => {
    if (preferences) {
      setFormData(preferences);
    }
  }, [preferences]);

  const handleToggle = (field: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleTimeChange = (time: string) => {
    setFormData((prev: any) => ({
      ...prev,
      digestTime: time,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      await updatePreferences.mutateAsync(formData);
      setMessage({ type: 'success', text: 'Preferências salvas com sucesso!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (_error) {
      setMessage({ type: 'error', text: 'Erro ao salvar preferências. Tente novamente.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Carregando preferências...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Preferências de Notificações</h2>
          <p className="text-sm text-gray-600 mt-1">
            Configure como deseja receber notificações do sistema
          </p>
        </div>

        <div className="p-6 space-y-8">
          {/* In-App Notifications */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Notificações no Sistema</h3>
            </div>

            <div className="space-y-3 ml-7">
              {/* Master Toggle */}
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">Habilitar notificações no sistema</p>
                  <p className="text-sm text-gray-500">Ative/desative todas as notificações in-app</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.inAppEnabled ?? true}
                    onChange={() => handleToggle('inAppEnabled')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Individual Settings */}
              <NotificationToggle
                label="Viagem criada"
                description="Quando uma nova viagem for criada"
                checked={formData.travelCreated ?? true}
                onChange={() => handleToggle('travelCreated')}
                disabled={!formData.inAppEnabled}
              />

              <NotificationToggle
                label="Status da viagem alterado"
                description="Quando o status de uma viagem mudar"
                checked={formData.travelStatusChanged ?? true}
                onChange={() => handleToggle('travelStatusChanged')}
                disabled={!formData.inAppEnabled}
              />

              <NotificationToggle
                label="Pagamento recebido"
                description="Quando um pagamento for registrado"
                checked={formData.paymentReceived ?? true}
                onChange={() => handleToggle('paymentReceived')}
                disabled={!formData.inAppEnabled}
              />

              <NotificationToggle
                label="Viagem próxima"
                description="7 dias antes da partida"
                checked={formData.travelUpcoming ?? true}
                onChange={() => handleToggle('travelUpcoming')}
                disabled={!formData.inAppEnabled}
              />

              <NotificationToggle
                label="Pagamento vencendo"
                description="3 dias antes da data de partida com saldo devedor"
                checked={formData.paymentDueSoon ?? true}
                onChange={() => handleToggle('paymentDueSoon')}
                disabled={!formData.inAppEnabled}
              />

              <NotificationToggle
                label="Pagamento atrasado"
                description="Viagem com saldo devedor após a data de partida"
                checked={formData.paymentOverdue ?? true}
                onChange={() => handleToggle('paymentOverdue')}
                disabled={!formData.inAppEnabled}
              />

              <NotificationToggle
                label="Documentos pendentes"
                description="Quando houver documentos pendentes"
                checked={formData.documentsPending ?? true}
                onChange={() => handleToggle('documentsPending')}
                disabled={!formData.inAppEnabled}
              />
            </div>
          </div>

          {/* Email Notifications */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Notificações por E-mail</h3>
            </div>

            <div className="space-y-3 ml-7">
              {/* Master Toggle */}
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">Habilitar notificações por e-mail</p>
                  <p className="text-sm text-gray-500">Ative/desative todos os e-mails automáticos</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.emailEnabled ?? true}
                    onChange={() => handleToggle('emailEnabled')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>

              {/* Individual Settings */}
              <NotificationToggle
                label="Viagem criada"
                description="Receber e-mail quando uma viagem for criada"
                checked={formData.emailTravelCreated ?? true}
                onChange={() => handleToggle('emailTravelCreated')}
                disabled={!formData.emailEnabled}
              />

              <NotificationToggle
                label="Pagamento recebido"
                description="Receber e-mail quando um pagamento for registrado"
                checked={formData.emailPaymentReceived ?? true}
                onChange={() => handleToggle('emailPaymentReceived')}
                disabled={!formData.emailEnabled}
              />

              <NotificationToggle
                label="Viagem próxima"
                description="Lembrete 7 dias antes da partida"
                checked={formData.emailTravelUpcoming ?? true}
                onChange={() => handleToggle('emailTravelUpcoming')}
                disabled={!formData.emailEnabled}
              />

              <NotificationToggle
                label="Pagamento vencendo"
                description="Alerta 3 dias antes com saldo devedor"
                checked={formData.emailPaymentDueSoon ?? true}
                onChange={() => handleToggle('emailPaymentDueSoon')}
                disabled={!formData.emailEnabled}
              />

              <NotificationToggle
                label="Pagamento atrasado"
                description="Alerta urgente de pagamento atrasado"
                checked={formData.emailPaymentOverdue ?? true}
                onChange={() => handleToggle('emailPaymentOverdue')}
                disabled={!formData.emailEnabled}
              />

              <NotificationToggle
                label="Documentos pendentes"
                description="Lembrete de documentos pendentes"
                checked={formData.emailDocumentsPending ?? false}
                onChange={() => handleToggle('emailDocumentsPending')}
                disabled={!formData.emailEnabled}
              />
            </div>
          </div>

          {/* Digest Mode */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Modo Resumo Diário</h3>
            </div>

            <div className="space-y-3 ml-7">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-gray-900">Agrupar notificações em resumo diário</p>
                  <p className="text-sm text-gray-500">
                    Receba um e-mail diário com todas as notificações ao invés de e-mails individuais
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.digestMode ?? false}
                    onChange={() => handleToggle('digestMode')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              {formData.digestMode && (
                <div className="pl-4 border-l-2 border-purple-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Horário do resumo diário
                  </label>
                  <input
                    type="time"
                    value={formData.digestTime ?? '08:00'}
                    onChange={(e) => handleTimeChange(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Você receberá um e-mail diário neste horário com todas as notificações do dia anterior
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          {message && (
            <div
              className={`text-sm ${
                message.type === 'success' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {message.text}
            </div>
          )}
          <div className="ml-auto">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Salvando...' : 'Salvar Preferências'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for toggle rows
function NotificationToggle({
  label,
  description,
  checked,
  onChange,
  disabled = false,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between py-2 ${disabled ? 'opacity-50' : ''}`}>
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only peer"
        />
        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 peer-disabled:cursor-not-allowed"></div>
      </label>
    </div>
  );
}
