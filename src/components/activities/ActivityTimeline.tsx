'use client';

import { useState, useEffect } from 'react';
import {
  CheckCircle,
  Clock,
  DollarSign,
  Edit,
  MessageSquare,
  Phone,
  PlusCircle,
  TrendingUp,
  User,
} from 'lucide-react';
import { TableSkeleton } from '@/components/ui/Loading';
import { activity_type } from '@prisma/client';

interface Activity {
  id: string;
  activityType: activity_type;
  title: string;
  description?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: Date;
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
  travel?: {
    id: string;
    title: string;
  } | null;
  customer?: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
}

interface ActivityTimelineProps {
  travelId?: string;
  customerId?: string;
  limit?: number;
}

// Mapeamento de ícones e cores por tipo de atividade
const activityConfig: Record<
  activity_type,
  { icon: typeof CheckCircle; color: string; bgColor: string }
> = {
  created: {
    icon: PlusCircle,
    color: 'text-blue-600',
    bgColor: 'bg-blue-500',
  },
  updated: {
    icon: Edit,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-500',
  },
  status_change: {
    icon: TrendingUp,
    color: 'text-purple-600',
    bgColor: 'bg-purple-500',
  },
  payment: {
    icon: DollarSign,
    color: 'text-green-600',
    bgColor: 'bg-green-500',
  },
  contact: {
    icon: Phone,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-500',
  },
  note: {
    icon: MessageSquare,
    color: 'text-gray-600',
    bgColor: 'bg-gray-500',
  },
};

export default function ActivityTimeline({
  travelId,
  customerId,
  limit = 50,
}: ActivityTimelineProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [travelId, customerId]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (travelId) params.set('travelId', travelId);
      if (customerId) params.set('customerId', customerId);
      params.set('limit', limit.toString());

      const response = await fetch(`/api/activities?${params}`);

      if (!response.ok) {
        throw new Error('Erro ao carregar atividades');
      }

      const data = await response.json();
      setActivities(data.activities || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar timeline');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date | string) => {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRelativeTime = (date: Date | string) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffInMs = now.getTime() - activityDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'agora mesmo';
    if (diffInMinutes < 60) return `há ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
    if (diffInHours < 24) return `há ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    if (diffInDays < 7) return `há ${diffInDays} dia${diffInDays > 1 ? 's' : ''}`;

    return formatDate(date);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Histórico de Atividades</h3>
        </div>
        <div className="p-6">
          <TableSkeleton rows={3} cols={1} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Histórico de Atividades</h3>
        </div>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">Erro: {error}</p>
            <button
              onClick={loadActivities}
              className="mt-2 text-sm text-red-700 hover:text-red-900 underline"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Histórico de Atividades</h3>
      </div>

      <div className="p-6">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma atividade registrada ainda</p>
          </div>
        ) : (
          <div className="flow-root">
            <ul className="-mb-8">
              {activities.map((activity, activityIdx) => {
                const config = activityConfig[activity.activityType];
                const Icon = config.icon;

                return (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {activityIdx !== activities.length - 1 ? (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span
                            className={`h-8 w-8 rounded-full ${config.bgColor} flex items-center justify-center ring-8 ring-white`}
                          >
                            <Icon className="h-5 w-5 text-white" aria-hidden="true" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                            {activity.description && (
                              <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                            )}
                            {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                              <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                                {Object.entries(activity.metadata).map(([key, value]) => (
                                  <div key={key}>
                                    <span className="font-medium capitalize">{key}:</span>{' '}
                                    {typeof value === 'object'
                                      ? JSON.stringify(value)
                                      : String(value)}
                                  </div>
                                ))}
                              </div>
                            )}
                            <div className="flex items-center mt-2 space-x-4 text-xs text-gray-400">
                              <div className="flex items-center">
                                <User className="h-3 w-3 mr-1" />
                                {activity.user.firstName} {activity.user.lastName}
                              </div>
                              {activity.travel && (
                                <div className="flex items-center">
                                  <span className="text-xs">Viagem: {activity.travel.title}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right whitespace-nowrap text-sm text-gray-500">
                            <div className="text-xs font-medium">
                              {getRelativeTime(activity.createdAt)}
                            </div>
                            <div className="text-xs">{formatTime(activity.createdAt)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
