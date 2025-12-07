'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, Calendar, DollarSign, Clock, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';

interface Alert {
  id: string;
  type: 'upcoming' | 'due_soon' | 'overdue';
  title: string;
  description: string;
  actionUrl: string;
  severity: 'info' | 'warning' | 'error';
  travelId: string;
  customerName: string;
  destination: string;
  date?: Date;
  amount?: number;
}

export function AlertsDashboard() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/alerts');
      if (response.ok) {
        const data = await response.json();
        setAlerts(data.alerts || []);
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const groupedAlerts = {
    overdue: alerts.filter((a) => a.type === 'overdue'),
    due_soon: alerts.filter((a) => a.type === 'due_soon'),
    upcoming: alerts.filter((a) => a.type === 'upcoming'),
  };

  const totalAlerts = alerts.length;

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Alertas e Lembretes</h2>
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Carregando alertas...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Alertas e Lembretes</h2>
          {totalAlerts > 0 && (
            <span className="px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded-full">
              {totalAlerts}
            </span>
          )}
        </div>
      </div>

      {/* Alert Categories */}
      <div className="p-6">
        {totalAlerts === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Nenhum alerta pendente</p>
            <p className="text-sm text-gray-400 mt-1">Você está em dia com todas as viagens!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Overdue Alerts */}
            {groupedAlerts.overdue.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Pagamentos Atrasados ({groupedAlerts.overdue.length})
                </h3>
                <div className="space-y-2">
                  {groupedAlerts.overdue.map((alert) => (
                    <AlertCard key={alert.id} alert={alert} />
                  ))}
                </div>
              </div>
            )}

            {/* Due Soon Alerts */}
            {groupedAlerts.due_soon.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-orange-700 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Pagamentos Vencendo ({groupedAlerts.due_soon.length})
                </h3>
                <div className="space-y-2">
                  {groupedAlerts.due_soon.map((alert) => (
                    <AlertCard key={alert.id} alert={alert} />
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Travel Alerts */}
            {groupedAlerts.upcoming.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-blue-700 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Viagens Próximas ({groupedAlerts.upcoming.length})
                </h3>
                <div className="space-y-2">
                  {groupedAlerts.upcoming.map((alert) => (
                    <AlertCard key={alert.id} alert={alert} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function AlertCard({ alert }: { alert: Alert }) {
  const getAlertStyles = (severity: Alert['severity']) => {
    switch (severity) {
      case 'info':
        return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
      case 'warning':
        return 'bg-orange-50 border-orange-200 hover:bg-orange-100';
      case 'error':
        return 'bg-red-50 border-red-200 hover:bg-red-100';
    }
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'upcoming':
        return <Calendar className="w-5 h-5 text-blue-600" />;
      case 'due_soon':
        return <Clock className="w-5 h-5 text-orange-600" />;
      case 'overdue':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
    }
  };

  return (
    <Link href={alert.actionUrl}>
      <div
        className={`border rounded-lg p-4 transition-colors ${getAlertStyles(alert.severity)}`}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">{getAlertIcon(alert.type)}</div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 mb-1">{alert.title}</p>
            <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="font-medium">Cliente:</span> {alert.customerName}
              </span>
              <span className="flex items-center gap-1">
                <span className="font-medium">Destino:</span> {alert.destination}
              </span>
              {alert.date && (
                <span className="flex items-center gap-1">
                  <span className="font-medium">Data:</span>{' '}
                  {format(new Date(alert.date), 'dd/MM/yyyy', { locale: ptBR })}
                </span>
              )}
              {alert.amount && (
                <span className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  {alert.amount.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </span>
              )}
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
        </div>
      </div>
    </Link>
  );
}
