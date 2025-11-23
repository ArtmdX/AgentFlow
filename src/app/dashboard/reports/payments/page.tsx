'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { exportToCSV, exportToPDF, formatCurrencyForExport } from '@/lib/export';

interface PaymentsReportData {
  metrics: {
    totalReceived: number;
    totalToReceive: number;
    overdueAmount: number;
    totalPayments: number;
  };
  paymentsByMethod: Array<{
    method: string;
    count: number;
    amount: number;
  }>;
  paymentsByCurrency: Array<{
    currency: string;
    count: number;
    amount: number;
  }>;
  cashFlowByMonth: Array<{
    month: string;
    count: number;
    amount: number;
  }>;
  agingAnalysis: Array<{
    range: string;
    amount: number;
  }>;
  overdueTravels: Array<{
    id: string;
    totalValue: number;
    paidValue: number;
    balance: number;
    departureDate: Date;
  }>;
  recentPayments: Array<{
    id: string;
    amount: number;
    currency: string;
    paymentMethod: string;
    paymentDate: Date;
    travelTitle: string;
    customerName: string;
    createdBy: string;
  }>;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const METHOD_LABELS: Record<string, string> = {
  'cash': 'Dinheiro',
  'credit_card': 'Cartão de Crédito',
  'debit_card': 'Cartão de Débito',
  'bank_transfer': 'Transferência',
  'pix': 'PIX',
  'check': 'Cheque'
};

export default function PaymentsReportPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currency, setCurrency] = useState('all');
  const [paymentMethod, setPaymentMethod] = useState('all');

  const { data, isLoading } = useQuery<PaymentsReportData>({
    queryKey: ['payments-report', startDate, endDate, currency, paymentMethod],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (currency) params.append('currency', currency);
      if (paymentMethod) params.append('paymentMethod', paymentMethod);

      const res = await fetch(`/api/reports/payments?${params.toString()}`);
      if (!res.ok) throw new Error('Erro ao carregar relatório');
      return res.json();
    }
  });

  const handleExportCSV = () => {
    if (!data) return;

    const exportData = data.cashFlowByMonth.map(item => ({
      'Mês': item.month,
      'Quantidade': item.count,
      'Valor': formatCurrencyForExport(item.amount)
    }));

    exportToCSV(exportData, 'relatorio-pagamentos');
  };

  const handleExportPDF = () => {
    if (!data) return;

    const exportData = data.cashFlowByMonth.map(item => ({
      month: item.month,
      count: item.count.toString(),
      amount: formatCurrencyForExport(item.amount)
    }));

    exportToPDF(
      exportData,
      [
        { header: 'Mês', dataKey: 'month' },
        { header: 'Quantidade', dataKey: 'count' },
        { header: 'Valor', dataKey: 'amount' }
      ],
      'relatorio-pagamentos',
      'Relatório de Pagamentos'
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Relatório de Pagamentos</h1>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Exportar CSV
          </button>
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Exportar PDF
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Inicial
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Final
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Moeda
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas</option>
              <option value="BRL">BRL</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="ARS">ARS</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Método
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos</option>
              <option value="cash">Dinheiro</option>
              <option value="credit_card">Cartão de Crédito</option>
              <option value="debit_card">Cartão de Débito</option>
              <option value="bank_transfer">Transferência</option>
              <option value="pix">PIX</option>
              <option value="check">Cheque</option>
            </select>
          </div>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-sm text-gray-600">Total Recebido</p>
          <p className="text-3xl font-bold text-green-600">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data?.metrics.totalReceived || 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-sm text-gray-600">A Receber</p>
          <p className="text-3xl font-bold text-blue-600">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data?.metrics.totalToReceive || 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-sm text-gray-600">Vencido</p>
          <p className="text-3xl font-bold text-red-600">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data?.metrics.overdueAmount || 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-sm text-gray-600">Total de Pagamentos</p>
          <p className="text-3xl font-bold text-gray-900">{data?.metrics.totalPayments || 0}</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fluxo de Caixa */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Fluxo de Caixa</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data?.cashFlowByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="amount" stroke="#10B981" name="Valor" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pagamentos por Método */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pagamentos por Método</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data?.paymentsByMethod.map(item => ({
                  ...item,
                  name: METHOD_LABELS[item.method] || item.method
                }))}
                dataKey="amount"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {data?.paymentsByMethod.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Análise de Aging */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Análise de Aging (Contas a Receber)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data?.agingAnalysis}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#EF4444" name="Valor" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pagamentos por Moeda */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pagamentos por Moeda</h2>
          <div className="space-y-3">
            {data?.paymentsByCurrency.map((item) => (
              <div key={item.currency} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-bold">{item.currency}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.currency}</p>
                    <p className="text-sm text-gray-600">{item.count} pagamentos</p>
                  </div>
                </div>
                <p className="font-semibold text-gray-900">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: item.currency }).format(item.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pagamentos Recentes */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Pagamentos Recentes</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Viagem
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Método
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.recentPayments.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(payment.paymentDate).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.travelTitle}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {METHOD_LABELS[payment.paymentMethod] || payment.paymentMethod}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: payment.currency }).format(payment.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
