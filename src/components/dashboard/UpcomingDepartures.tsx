'use client';

interface Departure {
  id: string;
  title: string;
  customer: string;
  destination: string;
  departureDate: Date;
  status: string;
  totalValue: number;
  paidValue: number;
}

interface UpcomingDeparturesProps {
  departures: Departure[];
}

const STATUS_LABELS: Record<string, string> = {
  'orcamento': 'Orçamento',
  'aguardando_pagamento': 'Aguardando Pagamento',
  'confirmada': 'Confirmada',
  'em_andamento': 'Em Andamento',
  'finalizada': 'Finalizada',
  'cancelada': 'Cancelada'
};

const STATUS_COLORS: Record<string, string> = {
  'orcamento': 'bg-gray-100 text-gray-800',
  'aguardando_pagamento': 'bg-yellow-100 text-yellow-800',
  'confirmada': 'bg-green-100 text-green-800',
  'em_andamento': 'bg-blue-100 text-blue-800',
  'finalizada': 'bg-purple-100 text-purple-800',
  'cancelada': 'bg-red-100 text-red-800'
};

export default function UpcomingDepartures({ departures }: UpcomingDeparturesProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Próximas Partidas (30 dias)</h3>
      <div className="space-y-3">
        {departures.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Nenhuma partida nos próximos 30 dias</p>
        ) : (
          departures.map((departure) => {
            const daysUntil = Math.ceil(
              (new Date(departure.departureDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            );

            return (
              <div
                key={departure.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{departure.title}</h4>
                    <p className="text-sm text-gray-600">{departure.customer}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      STATUS_COLORS[departure.status] || 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {STATUS_LABELS[departure.status] || departure.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-600">
                      📍 {departure.destination}
                    </span>
                    <span className="text-gray-600">
                      📅 {new Date(departure.departureDate).toLocaleDateString('pt-BR')}
                    </span>
                    <span
                      className={`font-medium ${
                        daysUntil <= 7 ? 'text-red-600' : 'text-blue-600'
                      }`}
                    >
                      {daysUntil === 0 ? 'Hoje' : daysUntil === 1 ? 'Amanhã' : `${daysUntil} dias`}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      Pago: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(departure.paidValue)}
                    </p>
                    <p className="font-medium text-gray-900">
                      Total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(departure.totalValue)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
