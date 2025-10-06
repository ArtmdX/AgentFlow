'use client';

import { Filter } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

export interface TravelFiltersState {
  status?: string;
  startDate?: string;
  endDate?: string;
  destination?: string;
  customer?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface TravelFiltersProps {
  filters: TravelFiltersState;
  onFilterChange: (filters: TravelFiltersState) => void;
  onClearFilters: () => void;
}

export default function TravelFilters({ filters, onFilterChange, onClearFilters }: TravelFiltersProps) {
  const updateFilter = (key: keyof TravelFiltersState, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value || undefined
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== '');

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          Filtros
        </h3>
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            Limpar Filtros
          </Button>
        )}
      </div>

      <div className="p-6">
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
    </div>
  );
}
