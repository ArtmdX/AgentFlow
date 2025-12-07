'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Download,
  FileText,
  User,
  Calendar,
  AlertCircle
} from 'lucide-react';
import AuditDetails from './AuditDetails';
import { toast } from 'react-toastify';

interface Activity {
  id: string;
  activityType: string;
  title: string;
  description: string | null;
  metadata: any;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  travel: {
    id: string;
    title: string;
    destination: string;
  } | null;
  customer: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
}

interface AuditTableProps {
  activities: Activity[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  onPageChange: (page: number) => void;
  onExport: (format: 'csv' | 'pdf') => void;
  isExporting?: boolean;
}

const ACTIVITY_TYPE_LABELS: Record<string, string> = {
  status_change: 'Mudança de Status',
  payment: 'Pagamento',
  contact: 'Contato',
  note: 'Nota',
  created: 'Criação',
  updated: 'Atualização',
};

const ACTIVITY_TYPE_COLORS: Record<string, string> = {
  status_change: 'bg-blue-100 text-blue-800',
  payment: 'bg-green-100 text-green-800',
  contact: 'bg-purple-100 text-purple-800',
  note: 'bg-yellow-100 text-yellow-800',
  created: 'bg-emerald-100 text-emerald-800',
  updated: 'bg-orange-100 text-orange-800',
};

export default function AuditTable({
  activities,
  pagination,
  onPageChange,
  onExport,
  isExporting = false
}: AuditTableProps) {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      onExport(format);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Erro ao exportar dados');
    }
  };

  const getEntityInfo = (activity: Activity) => {
    if (activity.travel) {
      return `${activity.travel.title} - ${activity.travel.destination}`;
    }
    if (activity.customer) {
      return `${activity.customer.firstName} ${activity.customer.lastName}`;
    }
    return '-';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Log de Auditoria
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Total de {pagination.totalCount} registro{pagination.totalCount !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('csv')}
            disabled={isExporting}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            <Download className="h-4 w-4" />
            CSV
          </button>
          <button
            onClick={() => handleExport('pdf')}
            disabled={isExporting}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            <Download className="h-4 w-4" />
            PDF
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Data/Hora
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Usuário
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Título
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Entidade
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {activities.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">Nenhuma atividade encontrada</p>
                  <p className="text-sm text-gray-500 mt-1">Ajuste os filtros para ver mais resultados</p>
                </td>
              </tr>
            ) : (
              activities.map((activity) => (
                <tr
                  key={activity.id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedActivity(activity)}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">
                        {format(new Date(activity.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                      </span>
                      <span className="text-gray-600">
                        {format(new Date(activity.createdAt), 'HH:mm', { locale: ptBR })}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {activity.user.firstName} {activity.user.lastName}
                        </p>
                        <p className="text-xs text-gray-600">
                          {activity.user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${ACTIVITY_TYPE_COLORS[activity.activityType] || 'bg-gray-100 text-gray-800'}`}>
                      {ACTIVITY_TYPE_LABELS[activity.activityType] || activity.activityType}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="max-w-md">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.title}
                      </p>
                      {activity.description && (
                        <p className="text-xs text-gray-600 truncate mt-1">
                          {activity.description}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-gray-900">
                      <FileText className="h-4 w-4 text-gray-400" />
                      {getEntityInfo(activity)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedActivity(activity);
                      }}
                      className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="Ver detalhes"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Página {pagination.page} de {pagination.totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={!pagination.hasPreviousPage}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </button>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={!pagination.hasNextPage}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              Próxima
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal de Detalhes */}
      {selectedActivity && (
        <AuditDetails
          activity={selectedActivity}
          onClose={() => setSelectedActivity(null)}
        />
      )}
    </div>
  );
}
