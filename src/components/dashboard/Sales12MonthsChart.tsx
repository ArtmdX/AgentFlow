'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MonthlyData {
  month: string;
  travels: number;
  revenue: number;
  paid: number;
}

interface Sales12MonthsChartProps {
  data: MonthlyData[];
}

export default function Sales12MonthsChart({ data }: Sales12MonthsChartProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendas Últimos 12 Meses</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip
            formatter={(value: number, name: string) => {
              if (name === 'Viagens') return value;
              return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(value);
            }}
          />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="travels"
            stroke="#3B82F6"
            name="Viagens"
            strokeWidth={2}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="revenue"
            stroke="#10B981"
            name="Receita"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
