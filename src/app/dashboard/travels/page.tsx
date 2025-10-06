'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { TravelTable } from "@/components/travels/TravelTable";
import TravelFilters, { TravelFiltersState } from "@/components/travels/TravelFilters";
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function TravelsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Inicializar filtros a partir da URL
  const [filters, setFilters] = useState<TravelFiltersState>({
    status: searchParams.get('status') || undefined,
    startDate: searchParams.get('startDate') || undefined,
    endDate: searchParams.get('endDate') || undefined,
    destination: searchParams.get('destination') || undefined,
    customer: searchParams.get('customer') || undefined,
    sortBy: searchParams.get('sortBy') || 'departureDate',
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc'
  });

  // Sincronizar filtros com a URL
  const updateURL = useCallback((newFilters: TravelFiltersState) => {
    const params = new URLSearchParams();

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.set(key, value);
      }
    });

    const queryString = params.toString();
    router.push(`/dashboard/travels${queryString ? `?${queryString}` : ''}`, { scroll: false });
  }, [router]);

  // Atualizar filtros
  const handleFilterChange = useCallback((newFilters: TravelFiltersState) => {
    setFilters(newFilters);
    updateURL(newFilters);
  }, [updateURL]);

  // Limpar filtros
  const handleClearFilters = useCallback(() => {
    const clearedFilters: TravelFiltersState = {
      sortBy: 'departureDate',
      sortOrder: 'desc'
    };
    setFilters(clearedFilters);
    updateURL(clearedFilters);
  }, [updateURL]);

  // Criar URLSearchParams para passar para a tabela
  const [queryParams, setQueryParams] = useState<URLSearchParams>(new URLSearchParams());

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.set(key, value);
      }
    });
    setQueryParams(params);
  }, [filters]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Minhas Viagens</h2>
          <p className="text-gray-600">Gerencie todos os seus orçamentos e viagens confirmadas.</p>
        </div>
        <Link href="/dashboard/travels/new">
          <Button className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer">
            <PlusCircle className="h-5 w-5" />
            <span>Nova Viagem</span>
          </Button>
        </Link>
      </div>

      <TravelFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      <TravelTable queryParams={queryParams} />
    </div>
  );
}
