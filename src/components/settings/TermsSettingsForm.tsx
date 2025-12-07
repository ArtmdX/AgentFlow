'use client';

/**
 * TermsSettingsForm Component
 * Form for terms of service and privacy policy
 */

import { FileText } from 'lucide-react';

interface TermsSettingsFormProps {
  data: any;
  onChange: (field: string, value: any) => void;
}

export default function TermsSettingsForm({ data, onChange }: TermsSettingsFormProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b">
        <FileText className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Termos e Políticas</h3>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <p className="font-medium mb-1">Informação</p>
        <p>
          Configure os termos de uso e política de privacidade da sua agência.
          Estes textos podem ser exibidos em contratos e documentos.
        </p>
      </div>

      {/* Terms of Service */}
      <div>
        <label htmlFor="termsOfService" className="block text-sm font-medium text-gray-700 mb-2">
          Termos de Uso
        </label>
        <textarea
          id="termsOfService"
          rows={10}
          value={data.termsOfService || ''}
          onChange={(e) => onChange('termsOfService', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
          placeholder="Digite aqui os termos de uso da sua agência...

Exemplo:
1. ACEITAÇÃO DOS TERMOS
Ao utilizar os serviços da nossa agência de viagens, você concorda com os termos e condições estabelecidos neste documento.

2. SERVIÇOS OFERECIDOS
Nossa agência oferece serviços de planejamento, reserva e organização de viagens...

3. RESPONSABILIDADES
..."
        />
        <p className="text-sm text-gray-500 mt-1">
          {(data.termsOfService?.length || 0).toLocaleString()} caracteres
        </p>
      </div>

      {/* Privacy Policy */}
      <div>
        <label htmlFor="privacyPolicy" className="block text-sm font-medium text-gray-700 mb-2">
          Política de Privacidade
        </label>
        <textarea
          id="privacyPolicy"
          rows={10}
          value={data.privacyPolicy || ''}
          onChange={(e) => onChange('privacyPolicy', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
          placeholder="Digite aqui a política de privacidade da sua agência...

Exemplo:
1. COLETA DE INFORMAÇÕES
Coletamos informações pessoais quando você se cadastra em nosso sistema, realiza reservas ou entra em contato conosco.

2. USO DAS INFORMAÇÕES
As informações coletadas são utilizadas para:
- Processar suas reservas e pagamentos
- Enviar confirmações e atualizações sobre suas viagens
- Melhorar nossos serviços

3. PROTEÇÃO DE DADOS
Seus dados são protegidos por medidas de segurança...
..."
        />
        <p className="text-sm text-gray-500 mt-1">
          {(data.privacyPolicy?.length || 0).toLocaleString()} caracteres
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
        <p className="font-medium mb-1">Recomendação</p>
        <p>
          Consulte um advogado especializado para elaborar termos de uso e política de
          privacidade adequados à legislação vigente (LGPD, Código de Defesa do Consumidor, etc.).
        </p>
      </div>
    </div>
  );
}
