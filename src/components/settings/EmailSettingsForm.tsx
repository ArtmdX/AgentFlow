'use client';

/**
 * EmailSettingsForm Component
 * Form for SMTP email configuration with test functionality
 */

import { useState } from 'react';
import { Mail, Check, X, Loader2 } from 'lucide-react';
import { useTestSmtp } from '@/hooks/useSettings';

interface EmailSettingsFormProps {
  data: any;
  onChange: (field: string, value: any) => void;
}

export default function EmailSettingsForm({ data, onChange }: EmailSettingsFormProps) {
  const [testEmail, setTestEmail] = useState('');
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const testSmtp = useTestSmtp();

  const handleTestConnection = async () => {
    if (!data.smtpHost || !data.smtpPort || !data.smtpUser || !data.smtpPassword) {
      alert('Preencha todos os campos obrigatórios antes de testar');
      return;
    }

    if (!testEmail) {
      alert('Informe um email para teste');
      return;
    }

    setTestResult(null);

    try {
      const result = await testSmtp.mutateAsync({
        smtpHost: data.smtpHost,
        smtpPort: data.smtpPort,
        smtpUser: data.smtpUser,
        smtpPassword: data.smtpPassword === '********' ? '' : data.smtpPassword,
        smtpSecure: data.smtpSecure || false,
        smtpFromEmail: data.smtpFromEmail || data.smtpUser,
        smtpFromName: data.smtpFromName || 'AgentFlow',
        testEmail,
      });

      setTestResult(result);
    } catch (error: any) {
      setTestResult({
        success: false,
        message: error.message || 'Erro ao testar conexão',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b">
        <Mail className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Configurações de Email (SMTP)</h3>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <p className="font-medium mb-1">Informação</p>
        <p>Configure as credenciais SMTP para envio de emails automáticos do sistema.</p>
      </div>

      {/* SMTP Host */}
      <div>
        <label htmlFor="smtpHost" className="block text-sm font-medium text-gray-700 mb-2">
          Servidor SMTP (Host)
        </label>
        <input
          type="text"
          id="smtpHost"
          value={data.smtpHost || ''}
          onChange={(e) => onChange('smtpHost', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="smtp.gmail.com"
        />
      </div>

      {/* SMTP Port */}
      <div>
        <label htmlFor="smtpPort" className="block text-sm font-medium text-gray-700 mb-2">
          Porta SMTP
        </label>
        <input
          type="number"
          id="smtpPort"
          value={data.smtpPort || 587}
          onChange={(e) => onChange('smtpPort', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="587"
        />
        <p className="text-sm text-gray-500 mt-1">
          Porta comum: 587 (TLS) ou 465 (SSL)
        </p>
      </div>

      {/* SMTP User */}
      <div>
        <label htmlFor="smtpUser" className="block text-sm font-medium text-gray-700 mb-2">
          Usuário SMTP
        </label>
        <input
          type="text"
          id="smtpUser"
          value={data.smtpUser || ''}
          onChange={(e) => onChange('smtpUser', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="seu-email@gmail.com"
        />
      </div>

      {/* SMTP Password */}
      <div>
        <label htmlFor="smtpPassword" className="block text-sm font-medium text-gray-700 mb-2">
          Senha SMTP
        </label>
        <input
          type="password"
          id="smtpPassword"
          value={data.smtpPassword || ''}
          onChange={(e) => onChange('smtpPassword', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="••••••••"
        />
        <p className="text-sm text-gray-500 mt-1">
          A senha é criptografada antes de ser salva
        </p>
      </div>

      {/* SSL/TLS */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="smtpSecure"
          checked={data.smtpSecure || false}
          onChange={(e) => onChange('smtpSecure', e.target.checked)}
          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
        />
        <label htmlFor="smtpSecure" className="text-sm font-medium text-gray-700">
          Usar SSL/TLS (Porta 465)
        </label>
      </div>

      {/* From Email */}
      <div>
        <label htmlFor="smtpFromEmail" className="block text-sm font-medium text-gray-700 mb-2">
          Email Remetente
        </label>
        <input
          type="email"
          id="smtpFromEmail"
          value={data.smtpFromEmail || ''}
          onChange={(e) => onChange('smtpFromEmail', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="noreply@agencia.com"
        />
      </div>

      {/* From Name */}
      <div>
        <label htmlFor="smtpFromName" className="block text-sm font-medium text-gray-700 mb-2">
          Nome Remetente
        </label>
        <input
          type="text"
          id="smtpFromName"
          value={data.smtpFromName || ''}
          onChange={(e) => onChange('smtpFromName', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="AgentFlow"
        />
      </div>

      {/* Test Connection */}
      <div className="pt-4 border-t">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Testar Conexão</h4>
        <div className="flex gap-3">
          <input
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="email@teste.com"
          />
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testSmtp.isPending}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {testSmtp.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Testando...
              </>
            ) : (
              'Enviar Teste'
            )}
          </button>
        </div>

        {/* Test Result */}
        {testResult && (
          <div
            className={`mt-3 p-3 rounded-lg flex items-start gap-2 ${
              testResult.success
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            {testResult.success ? (
              <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
            ) : (
              <X className="w-5 h-5 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-medium">
                {testResult.success ? 'Sucesso!' : 'Erro'}
              </p>
              <p className="text-sm">{testResult.message}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
