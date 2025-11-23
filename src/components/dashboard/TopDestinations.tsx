'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Destination {
  destination: string;
  count: number;
  revenue: number;
}

interface TopDestinationsProps {
  destinations: Destination[];
}

export default function TopDestinations({ destinations }: TopDestinationsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Destinos</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={destinations}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="destination" />
          <YAxis />
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
          <Bar dataKey="count" fill="#3B82F6" name="Viagens" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
