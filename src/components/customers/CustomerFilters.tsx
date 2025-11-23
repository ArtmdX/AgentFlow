'use client';

import { useState } from 'react';
import { Filter, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

export interface CustomerFiltersState {
  search?: string;
  documentType?: string;
  city?: string;
  state?: string;
  country?: string;
  isActive?: string;
  createdStartDate?: string;
  createdEndDate?: string;
  lastTravelStartDate?: string;
  lastTravelEndDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface CustomerFiltersProps {
  filters: CustomerFiltersState;
  onFilterChange: (filters: CustomerFiltersState) => void;
  onClearFilters: () => void;
}

export default function CustomerFilters({ filters, onFilterChange, onClearFilters }: CustomerFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const updateFilter = (key: keyof CustomerFiltersState, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value || undefined
    });
  };

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'sortBy' || key === 'sortOrder') return false;
    return value !== undefined && value !== '';
  }).length;

  const hasActiveFilters = activeFilterCount > 0;

  const BRAZILIAN_STATES = [
    { code: 'AC', name: 'Acre' },
    { code: 'AL', name: 'Alagoas' },
    { code: 'AP', name: 'Amapá' },
    { code: 'AM', name: 'Amazonas' },
    { code: 'BA', name: 'Bahia' },
    { code: 'CE', name: 'Ceará' },
    { code: 'DF', name: 'Distrito Federal' },
    { code: 'ES', name: 'Espírito Santo' },
    { code: 'GO', name: 'Goiás' },
    { code: 'MA', name: 'Maranhão' },
    { code: 'MT', name: 'Mato Grosso' },
    { code: 'MS', name: 'Mato Grosso do Sul' },
    { code: 'MG', name: 'Minas Gerais' },
    { code: 'PA', name: 'Pará' },
    { code: 'PB', name: 'Paraíba' },
    { code: 'PR', name: 'Paraná' },
    { code: 'PE', name: 'Pernambuco' },
    { code: 'PI', name: 'Piauí' },
    { code: 'RJ', name: 'Rio de Janeiro' },
    { code: 'RN', name: 'Rio Grande do Norte' },
    { code: 'RS', name: 'Rio Grande do Sul' },
    { code: 'RO', name: 'Rondônia' },
    { code: 'RR', name: 'Roraima' },
    { code: 'SC', name: 'Santa Catarina' },
    { code: 'SP', name: 'São Paulo' },
    { code: 'SE', name: 'Sergipe' },
    { code: 'TO', name: 'Tocantins' }
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors"
        >
          <Filter className="h-5 w-5" />
          Filtros
          {hasActiveFilters && (
            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
              {activeFilterCount}
            </span>
          )}
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 ml-1" />
          ) : (
            <ChevronDown className="h-4 w-4 ml-1" />
          )}
        </button>

        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={onClearFilters} className="flex items-center gap-2">
            <X className="h-4 w-4" />
            Limpar Filtros
          </Button>
        )}
      </div>

      {isExpanded && (
        <div className="p-6">
          {/* Active Filters Badges */}
          {hasActiveFilters && (
            <div className="mb-4 flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, value]) => {
                if (key === 'sortBy' || key === 'sortOrder' || !value) return null;

                const labels: Record<string, string> = {
                  search: 'Busca',
                  documentType: 'Tipo Documento',
                  city: 'Cidade',
                  state: 'Estado',
                  country: 'País',
                  isActive: 'Status',
                  createdStartDate: 'Cadastro De',
                  createdEndDate: 'Cadastro Até',
                  lastTravelStartDate: 'Última Viagem De',
                  lastTravelEndDate: 'Última Viagem Até'
                };

                return (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                  >
                    {labels[key]}: {value}
                    <button
                      onClick={() => updateFilter(key as keyof CustomerFiltersState, '')}
                      className="hover:text-blue-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                );
              })}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Busca Geral */}
            <div className="lg:col-span-2">
              <Input
                label="Buscar"
                placeholder="Nome, CPF/CNPJ, e-mail, telefone..."
                value={filters.search || ''}
                onChange={(e) => updateFilter('search', e.target.value)}
              />
            </div>

            {/* Tipo de Documento */}
            <Select
              label="Tipo de Documento"
              value={filters.documentType || ''}
              onChange={(e) => updateFilter('documentType', e.target.value)}
            >
              <option value="">Todos</option>
              <option value="cpf">CPF</option>
              <option value="cnpj">CNPJ</option>
              <option value="passport">Passaporte</option>
              <option value="rg">RG</option>
            </Select>

            {/* Status */}
            <Select
              label="Status"
              value={filters.isActive || ''}
              onChange={(e) => updateFilter('isActive', e.target.value)}
            >
              <option value="">Todos</option>
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
            </Select>

            {/* Cidade */}
            <Input
              label="Cidade"
              placeholder="Filtrar por cidade..."
              value={filters.city || ''}
              onChange={(e) => updateFilter('city', e.target.value)}
            />

            {/* Estado */}
            <Select
              label="Estado"
              value={filters.state || ''}
              onChange={(e) => updateFilter('state', e.target.value)}
            >
              <option value="">Todos os estados</option>
              {BRAZILIAN_STATES.map(state => (
                <option key={state.code} value={state.name}>
                  {state.name} ({state.code})
                </option>
              ))}
            </Select>

            {/* País */}
            <Input
              label="País"
              placeholder="Filtrar por país..."
              value={filters.country || ''}
              onChange={(e) => updateFilter('country', e.target.value)}
            />

            {/* Data de Cadastro - Início */}
            <Input
              label="Data de Cadastro (De)"
              type="date"
              value={filters.createdStartDate || ''}
              onChange={(e) => updateFilter('createdStartDate', e.target.value)}
            />

            {/* Data de Cadastro - Fim */}
            <Input
              label="Data de Cadastro (Até)"
              type="date"
              value={filters.createdEndDate || ''}
              onChange={(e) => updateFilter('createdEndDate', e.target.value)}
            />

            {/* Última Viagem - Início */}
            <Input
              label="Última Viagem (De)"
              type="date"
              value={filters.lastTravelStartDate || ''}
              onChange={(e) => updateFilter('lastTravelStartDate', e.target.value)}
            />

            {/* Última Viagem - Fim */}
            <Input
              label="Última Viagem (Até)"
              type="date"
              value={filters.lastTravelEndDate || ''}
              onChange={(e) => updateFilter('lastTravelEndDate', e.target.value)}
            />

            {/* Ordenação */}
            <Select
              label="Ordenar por"
              value={filters.sortBy || 'firstName'}
              onChange={(e) => updateFilter('sortBy', e.target.value)}
            >
              <option value="firstName">Nome</option>
              <option value="createdAt">Data de Cadastro</option>
              <option value="lastTravel">Última Viagem</option>
              <option value="city">Cidade</option>
              <option value="state">Estado</option>
            </Select>

            {/* Ordem */}
            <Select
              label="Ordem"
              value={filters.sortOrder || 'asc'}
              onChange={(e) => updateFilter('sortOrder', e.target.value)}
            >
              <option value="asc">Crescente</option>
              <option value="desc">Decrescente</option>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
