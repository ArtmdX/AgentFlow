'use client';

import { useState } from 'react';
import { Filter, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

export interface TravelFiltersState {
  status?: string;
  startDate?: string;
  endDate?: string;
  destination?: string;
  customer?: string;
  agentId?: string;
  minValue?: string;
  maxValue?: string;
  minPassengers?: string;
  maxPassengers?: string;
  isInternational?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface TravelFiltersProps {
  filters: TravelFiltersState;
  onFilterChange: (filters: TravelFiltersState) => void;
  onClearFilters: () => void;
  agents?: Array<{ id: string; firstName: string; lastName: string }>;
}

export default function TravelFilters({ filters, onFilterChange, onClearFilters, agents = [] }: TravelFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const updateFilter = (key: keyof TravelFiltersState, value: string) => {
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
                  status: 'Status',
                  startDate: 'De',
                  endDate: 'Até',
                  destination: 'Destino',
                  customer: 'Cliente',
                  agentId: 'Agente',
                  minValue: 'Valor Mín',
                  maxValue: 'Valor Máx',
                  minPassengers: 'Pass. Mín',
                  maxPassengers: 'Pass. Máx',
                  isInternational: 'Internacional'
                };

                return (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                  >
                    {labels[key]}: {value}
                    <button
                      onClick={() => updateFilter(key as keyof TravelFiltersState, '')}
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
            {/* Filtro de Status */}
            <Select
              label="Status"
              value={filters.status || ''}
              onChange={(e) => updateFilter('status', e.target.value)}
            >
              <option value="">Todos os status</option>
              <option value="orcamento">Orçamento</option>
              <option value="aguardando_pagamento">Aguardando Pagamento</option>
              <option value="confirmada">Confirmada</option>
              <option value="em_andamento">Em Andamento</option>
              <option value="finalizada">Finalizada</option>
              <option value="cancelada">Cancelada</option>
            </Select>

            {/* Filtro de Data Inicial */}
            <Input
              label="Data de Partida (De)"
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => updateFilter('startDate', e.target.value)}
            />

            {/* Filtro de Data Final */}
            <Input
              label="Data de Partida (Até)"
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => updateFilter('endDate', e.target.value)}
            />

            {/* Filtro de Destino */}
            <Input
              label="Destino"
              placeholder="Buscar por destino..."
              value={filters.destination || ''}
              onChange={(e) => updateFilter('destination', e.target.value)}
            />

            {/* Filtro de Cliente */}
            <Input
              label="Cliente"
              placeholder="Buscar por cliente..."
              value={filters.customer || ''}
              onChange={(e) => updateFilter('customer', e.target.value)}
            />

            {/* Filtro de Agente */}
            {agents.length > 0 && (
              <Select
                label="Agente Responsável"
                value={filters.agentId || ''}
                onChange={(e) => updateFilter('agentId', e.target.value)}
              >
                <option value="">Todos os agentes</option>
                {agents.map(agent => (
                  <option key={agent.id} value={agent.id}>
                    {agent.firstName} {agent.lastName}
                  </option>
                ))}
              </Select>
            )}

            {/* Filtro de Valor Mínimo */}
            <Input
              label="Valor Mínimo (R$)"
              type="number"
              min="0"
              step="0.01"
              placeholder="0,00"
              value={filters.minValue || ''}
              onChange={(e) => updateFilter('minValue', e.target.value)}
            />

            {/* Filtro de Valor Máximo */}
            <Input
              label="Valor Máximo (R$)"
              type="number"
              min="0"
              step="0.01"
              placeholder="0,00"
              value={filters.maxValue || ''}
              onChange={(e) => updateFilter('maxValue', e.target.value)}
            />

            {/* Filtro de Passageiros Mínimo */}
            <Input
              label="Nº Mínimo de Passageiros"
              type="number"
              min="1"
              placeholder="1"
              value={filters.minPassengers || ''}
              onChange={(e) => updateFilter('minPassengers', e.target.value)}
            />

            {/* Filtro de Passageiros Máximo */}
            <Input
              label="Nº Máximo de Passageiros"
              type="number"
              min="1"
              placeholder="10"
              value={filters.maxPassengers || ''}
              onChange={(e) => updateFilter('maxPassengers', e.target.value)}
            />

            {/* Filtro Internacional */}
            <Select
              label="Tipo de Viagem"
              value={filters.isInternational || ''}
              onChange={(e) => updateFilter('isInternational', e.target.value)}
            >
              <option value="">Todas</option>
              <option value="true">Internacional</option>
              <option value="false">Nacional</option>
            </Select>

            {/* Ordenação */}
            <Select
              label="Ordenar por"
              value={filters.sortBy || 'departureDate'}
              onChange={(e) => updateFilter('sortBy', e.target.value)}
            >
              <option value="departureDate">Data de Partida</option>
              <option value="totalValue">Valor Total</option>
              <option value="customer">Cliente</option>
              <option value="createdAt">Data de Criação</option>
              <option value="status">Status</option>
            </Select>

            {/* Ordem */}
            <Select
              label="Ordem"
              value={filters.sortOrder || 'desc'}
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
