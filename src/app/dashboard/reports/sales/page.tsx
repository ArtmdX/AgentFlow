'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { exportToCSV, exportToPDF, formatCurrencyForExport } from '@/lib/export';

interface SalesReportData {
  metrics: {
    totalTravels: number;
    totalRevenue: number;
    averageTicket: number;
    conversionRate: number;
    orcamentos: number;
    confirmadas: number;
  };
  salesByAgent: Array<{
    agentId: string;
    agentName: string;
    count: number;
    revenue: number;
  }>;
  salesByStatus: Array<{
    status: string;
    count: number;
    revenue: number;
  }>;
  topDestinations: Array<{
    destination: string;
    count: number;
    revenue: number;
  }>;
  salesByMonth: Array<{
    month: string;
    count: number;
    revenue: number;
  }>;
  topCustomers: Array<{
    customerId: string;
    customerName: string;
    count: number;
    revenue: number;
  }>;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function SalesReportPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('all');

  const { data, isLoading } = useQuery<SalesReportData>({
    queryKey: ['sales-report', startDate, endDate, status],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (status) params.append('status', status);

      const res = await fetch(`/api/reports/sales?${params.toString()}`);
      if (!res.ok) throw new Error('Erro ao carregar relatório');
      return res.json();
    }
  });

  const handleExportCSV = () => {
    if (!data) return;

    const exportData = data.salesByMonth.map(item => ({
      'Mês': item.month,
      'Quantidade': item.count,
      'Receita': formatCurrencyForExport(item.revenue)
    }));

    exportToCSV(exportData, 'relatorio-vendas');
  };

  const handleExportPDF = () => {
    if (!data) return;

    const exportData = data.salesByMonth.map(item => ({
      month: item.month,
      count: item.count.toString(),
      revenue: formatCurrencyForExport(item.revenue)
    }));

    exportToPDF(
      exportData,
      [
        { header: 'Mês', dataKey: 'month' },
        { header: 'Quantidade', dataKey: 'count' },
        { header: 'Receita', dataKey: 'revenue' }
      ],
      'relatorio-vendas',
      'Relatório de Vendas'
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
        <h1 className="text-2xl font-bold text-gray-900">Relatório de Vendas</h1>
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
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos</option>
              <option value="orcamento">Orçamento</option>
              <option value="aguardando_pagamento">Aguardando Pagamento</option>
              <option value="confirmada">Confirmada</option>
              <option value="em_andamento">Em Andamento</option>
              <option value="finalizada">Finalizada</option>
            </select>
          </div>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-sm text-gray-600">Total de Vendas</p>
          <p className="text-3xl font-bold text-gray-900">{data?.metrics.totalTravels || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-sm text-gray-600">Receita Total</p>
          <p className="text-3xl font-bold text-green-600">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data?.metrics.totalRevenue || 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-sm text-gray-600">Ticket Médio</p>
          <p className="text-3xl font-bold text-blue-600">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data?.metrics.averageTicket || 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-sm text-gray-600">Taxa de Conversão</p>
          <p className="text-3xl font-bold text-purple-600">{data?.metrics.conversionRate.toFixed(1) || 0}%</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendas por Mês */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Vendas por Mês</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data?.salesByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#3B82F6" name="Quantidade" />
              <Line type="monotone" dataKey="revenue" stroke="#10B981" name="Receita" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Vendas por Agente */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Vendas por Agente</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data?.salesByAgent}
                dataKey="revenue"
                nameKey="agentName"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {data?.salesByAgent.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Destinos */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Destinos</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data?.topDestinations}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="destination" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3B82F6" name="Quantidade" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Clientes */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Clientes</h2>
          <div className="space-y-3">
            {data?.topCustomers.map((customer, index) => (
              <div key={customer.customerId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{customer.customerName}</p>
                    <p className="text-sm text-gray-600">{customer.count} viagens</p>
                  </div>
                </div>
                <p className="font-semibold text-green-600">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(customer.revenue)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
