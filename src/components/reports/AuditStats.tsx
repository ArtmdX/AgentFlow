'use client';

import { Activity, BarChart3, PieChart, TrendingUp } from 'lucide-react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface AuditStatsProps {
  statistics: {
    total: number;
    byType: Array<{ type: string; count: number }>;
    byUser: Array<{ userId: string; userName: string; count: number }>;
  };
}

const ACTIVITY_TYPE_LABELS: Record<string, string> = {
  status_change: 'Mudança de Status',
  payment: 'Pagamento',
  contact: 'Contato',
  note: 'Nota',
  created: 'Criação',
  updated: 'Atualização',
};

const COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#8B5CF6', // Purple
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#F97316', // Orange
];

export default function AuditStats({ statistics }: AuditStatsProps) {
  // Preparar dados para o gráfico de pizza (por tipo)
  const pieData = statistics.byType.map(item => ({
    name: ACTIVITY_TYPE_LABELS[item.type] || item.type,
    value: item.count,
  }));

  // Preparar dados para o gráfico de barras (por usuário)
  const barData = statistics.byUser.slice(0, 10).map(item => ({
    name: item.userName.split(' ').slice(0, 2).join(' '), // Primeiros 2 nomes
    count: item.count,
  }));

  // Calcular percentual
  const getPercentage = (count: number) => {
    if (statistics.total === 0) return 0;
    return ((count / statistics.total) * 100).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total de Atividades */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total de Atividades
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {statistics.total.toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Tipo Mais Comum */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Tipo Mais Comum
              </p>
              {statistics.byType.length > 0 && (
                <>
                  <p className="text-lg font-bold text-gray-900 mt-2">
                    {ACTIVITY_TYPE_LABELS[statistics.byType[0].type] || statistics.byType[0].type}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {statistics.byType[0].count} atividades ({getPercentage(statistics.byType[0].count)}%)
                  </p>
                </>
              )}
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <PieChart className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Usuário Mais Ativo */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Usuário Mais Ativo
              </p>
              {statistics.byUser.length > 0 && (
                <>
                  <p className="text-lg font-bold text-gray-900 mt-2">
                    {statistics.byUser[0].userName}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {statistics.byUser[0].count} atividades ({getPercentage(statistics.byUser[0].count)}%)
                  </p>
                </>
              )}
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Pizza - Atividades por Tipo */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <PieChart className="h-5 w-5 text-gray-600" />
            Atividades por Tipo
          </h3>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>

              {/* Legenda */}
              <div className="mt-4 grid grid-cols-2 gap-2">
                {statistics.byType.map((item, index) => (
                  <div key={item.type} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-xs text-gray-600">
                      {ACTIVITY_TYPE_LABELS[item.type] || item.type}: {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              Sem dados para exibir
            </div>
          )}
        </div>

        {/* Gráfico de Barras - Atividades por Usuário */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-gray-600" />
            Top 10 Usuários Mais Ativos
          </h3>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="count"
                  fill="#3B82F6"
                  name="Atividades"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              Sem dados para exibir
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
