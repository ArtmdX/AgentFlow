'use client';

/**
 * CurrencySettingsForm Component
 * Form for currency settings and exchange rates
 */

import { DollarSign } from 'lucide-react';

interface CurrencySettingsFormProps {
  data: any;
  onChange: (field: string, value: any) => void;
}

export default function CurrencySettingsForm({ data, onChange }: CurrencySettingsFormProps) {
  const handleExchangeRateChange = (currency: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    onChange('exchangeRates', {
      ...(data.exchangeRates || { USD: 5.0, EUR: 5.5, ARS: 0.02 }),
      [currency]: numValue,
    });
  };

  const exchangeRates = data.exchangeRates || { USD: 5.0, EUR: 5.5, ARS: 0.02 };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b">
        <DollarSign className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Moeda e Câmbio</h3>
      </div>

      {/* Default Currency */}
      <div>
        <label htmlFor="defaultCurrency" className="block text-sm font-medium text-gray-700 mb-2">
          Moeda Padrão
        </label>
        <select
          id="defaultCurrency"
          value={data.defaultCurrency || 'BRL'}
          onChange={(e) => onChange('defaultCurrency', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="BRL">BRL - Real Brasileiro (R$)</option>
          <option value="USD">USD - Dólar Americano ($)</option>
          <option value="EUR">EUR - Euro (€)</option>
          <option value="ARS">ARS - Peso Argentino ($)</option>
        </select>
      </div>

      {/* Exchange Rates */}
      <div className="pt-4 border-t">
        <h4 className="text-sm font-semibold text-gray-700 mb-1">
          Taxas de Câmbio (para BRL)
        </h4>
        <p className="text-sm text-gray-500 mb-4">
          Defina as taxas de conversão de outras moedas para Real (BRL)
        </p>

        <div className="space-y-4">
          {/* USD */}
          <div className="flex items-center gap-4">
            <div className="w-20">
              <span className="text-sm font-medium text-gray-700">USD</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">1 USD =</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={exchangeRates.USD || 5.0}
                  onChange={(e) => handleExchangeRateChange('USD', e.target.value)}
                  className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <span className="text-sm text-gray-600">BRL</span>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Exemplo: $100 = R$ {((exchangeRates.USD || 5.0) * 100).toFixed(2)}
            </div>
          </div>

          {/* EUR */}
          <div className="flex items-center gap-4">
            <div className="w-20">
              <span className="text-sm font-medium text-gray-700">EUR</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">1 EUR =</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={exchangeRates.EUR || 5.5}
                  onChange={(e) => handleExchangeRateChange('EUR', e.target.value)}
                  className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <span className="text-sm text-gray-600">BRL</span>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Exemplo: €100 = R$ {((exchangeRates.EUR || 5.5) * 100).toFixed(2)}
            </div>
          </div>

          {/* ARS */}
          <div className="flex items-center gap-4">
            <div className="w-20">
              <span className="text-sm font-medium text-gray-700">ARS</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">1 ARS =</span>
                <input
                  type="number"
                  step="0.001"
                  min="0"
                  value={exchangeRates.ARS || 0.02}
                  onChange={(e) => handleExchangeRateChange('ARS', e.target.value)}
                  className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <span className="text-sm text-gray-600">BRL</span>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Exemplo: $1000 = R$ {((exchangeRates.ARS || 0.02) * 1000).toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
        <p className="font-medium mb-1">Atenção</p>
        <p>
          Atualize as taxas de câmbio regularmente para manter a precisão dos cálculos.
          Estas taxas são usadas para conversões automáticas no sistema.
        </p>
      </div>
    </div>
  );
}
