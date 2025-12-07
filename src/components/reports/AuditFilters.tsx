'use client';

import { useState, useEffect } from 'react';
import { Search, X, Calendar, User, FileText, Filter } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface AuditFiltersProps {
  onFilterChange: (filters: AuditFilterValues) => void;
  initialFilters?: Partial<AuditFilterValues>;
}

export interface AuditFilterValues {
  startDate?: string;
  endDate?: string;
  userId?: string;
  activityType?: string;
  entityType?: string;
  search?: string;
}

const ACTIVITY_TYPES = [
  { value: 'status_change', label: 'Mudança de Status' },
  { value: 'payment', label: 'Pagamento' },
  { value: 'contact', label: 'Contato' },
  { value: 'note', label: 'Nota' },
  { value: 'created', label: 'Criação' },
  { value: 'updated', label: 'Atualização' },
];

const ENTITY_TYPES = [
  { value: 'travel', label: 'Viagem' },
  { value: 'customer', label: 'Cliente' },
  { value: 'payment', label: 'Pagamento' },
];

export default function AuditFilters({ onFilterChange, initialFilters }: AuditFiltersProps) {
  const [filters, setFilters] = useState<AuditFilterValues>(initialFilters || {});
  const [isExpanded, setIsExpanded] = useState(false);

  // Buscar usuários para o select
  const { data: usersData } = useQuery({
    queryKey: ['users-for-audit'],
    queryFn: async () => {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Erro ao carregar usuários');
      return response.json();
    },
  });

  const users = usersData?.users || [];

  // Atualizar filtros quando mudar
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange(filters);
    }, 500); // Debounce de 500ms

    return () => clearTimeout(timer);
  }, [filters, onFilterChange]);

  const handleFilterChange = (key: keyof AuditFilterValues, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const handleReset = () => {
    setFilters({});
    onFilterChange({});
  };

  const hasActiveFilters = Object.values(filters).some(value => value);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
          {hasActiveFilters && (
            <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
              Ativos
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              Limpar
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            {isExpanded ? 'Recolher' : 'Expandir'}
          </button>
        </div>
      </div>

      {/* Busca sempre visível */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por título ou descrição..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Filtros expandidos */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Data Início */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="inline h-4 w-4 mr-1" />
              Data Início
            </label>
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Data Fim */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="inline h-4 w-4 mr-1" />
              Data Fim
            </label>
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Usuário */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <User className="inline h-4 w-4 mr-1" />
              Usuário
            </label>
            <select
              value={filters.userId || ''}
              onChange={(e) => handleFilterChange('userId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Todos</option>
              {users.map((user: any) => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* Tipo de Atividade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FileText className="inline h-4 w-4 mr-1" />
              Tipo de Atividade
            </label>
            <select
              value={filters.activityType || ''}
              onChange={(e) => handleFilterChange('activityType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Todos</option>
              {ACTIVITY_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tipo de Entidade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FileText className="inline h-4 w-4 mr-1" />
              Tipo de Entidade
            </label>
            <select
              value={filters.entityType || ''}
              onChange={(e) => handleFilterChange('entityType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Todos</option>
              {ENTITY_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
