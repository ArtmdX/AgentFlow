'use client';

/**
 * FinancialSettingsForm Component
 * Form for financial settings (interest, fines)
 */

import { Percent } from 'lucide-react';

interface FinancialSettingsFormProps {
  data: any;
  onChange: (field: string, value: any) => void;
}

export default function FinancialSettingsForm({ data, onChange }: FinancialSettingsFormProps) {
  const interestRate = data.interestRate || 0;
  const fineRate = data.fineRate || 0;

  // Calculate examples
  const baseAmount = 1000;
  const interest = (baseAmount * interestRate) / 100;
  const fine = (baseAmount * fineRate) / 100;
  const totalWithCharges = baseAmount + interest + fine;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b">
        <Percent className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Configurações Financeiras</h3>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <p className="font-medium mb-1">Informação</p>
        <p>
          Configure as taxas de juros e multa aplicadas em pagamentos atrasados.
          Estas taxas são aplicadas automaticamente no sistema.
        </p>
      </div>

      {/* Interest Rate */}
      <div>
        <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-2">
          Taxa de Juros (% ao mês)
        </label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            id="interestRate"
            step="0.01"
            min="0"
            max="100"
            value={interestRate}
            onChange={(e) => onChange('interestRate', parseFloat(e.target.value) || 0)}
            className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <span className="text-sm text-gray-600">% ao mês</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Juros cobrados mensalmente sobre o valor em atraso
        </p>
      </div>

      {/* Fine Rate */}
      <div>
        <label htmlFor="fineRate" className="block text-sm font-medium text-gray-700 mb-2">
          Taxa de Multa (%)
        </label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            id="fineRate"
            step="0.01"
            min="0"
            max="100"
            value={fineRate}
            onChange={(e) => onChange('fineRate', parseFloat(e.target.value) || 0)}
            className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <span className="text-sm text-gray-600">%</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Multa cobrada uma única vez sobre o valor em atraso
        </p>
      </div>

      {/* Calculation Example */}
      <div className="pt-4 border-t">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">
          Exemplo de Cálculo
        </h4>
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Valor Original:</span>
            <span className="font-medium">
              R$ {baseAmount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              Juros ({interestRate}% ao mês, 1 mês):
            </span>
            <span className="font-medium text-orange-600">
              + R$ {interest.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Multa ({fineRate}%):</span>
            <span className="font-medium text-red-600">
              + R$ {fine.toFixed(2)}
            </span>
          </div>
          <div className="pt-2 border-t border-gray-200 flex justify-between">
            <span className="text-sm font-semibold text-gray-700">
              Total com Encargos:
            </span>
            <span className="text-lg font-bold text-primary">
              R$ {totalWithCharges.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
        <p className="font-medium mb-1">Atenção</p>
        <p>
          As taxas configuradas devem estar de acordo com a legislação vigente e
          políticas da agência. Valores muito altos podem gerar problemas jurídicos.
        </p>
      </div>
    </div>
  );
}
