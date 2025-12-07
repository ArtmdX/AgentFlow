'use client';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { X, User, Calendar, FileText, Tag, MapPin } from 'lucide-react';
import { useEffect } from 'react';

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

interface AuditDetailsProps {
  activity: Activity;
  onClose: () => void;
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

export default function AuditDetails({ activity, onClose }: AuditDetailsProps) {
  // Fechar ao pressionar ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Formatar metadata JSON
  const formatMetadata = (metadata: any) => {
    if (!metadata) return null;

    try {
      return JSON.stringify(metadata, null, 2);
    } catch {
      return String(metadata);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Detalhes da Atividade
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-140px)]">
              {/* Informações Principais */}
              <div className="space-y-4">
                {/* Tipo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Tag className="inline h-4 w-4 mr-1" />
                    Tipo
                  </label>
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${ACTIVITY_TYPE_COLORS[activity.activityType] || 'bg-gray-100 text-gray-800'}`}>
                    {ACTIVITY_TYPE_LABELS[activity.activityType] || activity.activityType}
                  </span>
                </div>

                {/* Título */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FileText className="inline h-4 w-4 mr-1" />
                    Título
                  </label>
                  <p className="text-gray-900 text-base">{activity.title}</p>
                </div>

                {/* Descrição */}
                {activity.description && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição
                    </label>
                    <p className="text-gray-700 text-sm whitespace-pre-wrap">
                      {activity.description}
                    </p>
                  </div>
                )}

                {/* Usuário */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <User className="inline h-4 w-4 mr-1" />
                    Usuário
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {activity.user.firstName} {activity.user.lastName}
                      </p>
                      <p className="text-xs text-gray-600">{activity.user.email}</p>
                    </div>
                  </div>
                </div>

                {/* Data/Hora */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Data/Hora
                  </label>
                  <p className="text-gray-900 text-sm">
                    {format(new Date(activity.createdAt), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>

                {/* Viagem Relacionada */}
                {activity.travel && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <MapPin className="inline h-4 w-4 mr-1" />
                      Viagem Relacionada
                    </label>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm font-medium text-blue-900">
                        {activity.travel.title}
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
                        Destino: {activity.travel.destination}
                      </p>
                    </div>
                  </div>
                )}

                {/* Cliente Relacionado */}
                {activity.customer && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <User className="inline h-4 w-4 mr-1" />
                      Cliente Relacionado
                    </label>
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <p className="text-sm font-medium text-purple-900">
                        {activity.customer.firstName} {activity.customer.lastName}
                      </p>
                    </div>
                  </div>
                )}

                {/* Metadata */}
                {activity.metadata && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Metadados (JSON)
                    </label>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                      <pre className="text-xs font-mono whitespace-pre-wrap">
                        {formatMetadata(activity.metadata)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
