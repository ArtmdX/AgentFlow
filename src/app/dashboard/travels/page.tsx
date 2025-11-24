"use client";

import { useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { TravelTable } from "@/components/travels/TravelTable";
import TravelFilters, { TravelFiltersState } from "@/components/travels/TravelFilters";
import { useTravels } from "@/hooks/useTravels";

function TravelsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Inicializar filtros a partir da URL
  const [filters, setFilters] = useState<TravelFiltersState>({
    status: searchParams.get("status") || undefined,
    startDate: searchParams.get("startDate") || undefined,
    endDate: searchParams.get("endDate") || undefined,
    destination: searchParams.get("destination") || undefined,
    customer: searchParams.get("customer") || undefined,
    sortBy: searchParams.get("sortBy") || "departureDate",
    sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
  });

  // Estado de paginação
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1", 10));
  const [limit, setLimit] = useState(parseInt(searchParams.get("limit") || "25", 10));

  // React Query para buscar viagens
  const { data, isLoading, error } = useTravels({
    page,
    limit,
    ...filters,
  });

  // Extrair dados da resposta do React Query
  const travels = data?.travels || [];
  const pagination = data?.pagination || {
    page: 1,
    limit: 25,
    total: 0,
    totalPages: 0,
  };

  // Sincronizar filtros e paginação com a URL
  const updateURL = useCallback(
    (newFilters: TravelFiltersState, newPage?: number, newLimit?: number) => {
      const params = new URLSearchParams();

      Object.entries(newFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params.set(key, value);
        }
      });

      // Adicionar parâmetros de paginação
      params.set("page", (newPage || page).toString());
      params.set("limit", (newLimit || limit).toString());

      const queryString = params.toString();
      router.push(`/dashboard/travels${queryString ? `?${queryString}` : ""}`, { scroll: false });
    },
    [router, page, limit]
  );

  // Atualizar filtros (resetar para página 1)
  const handleFilterChange = useCallback(
    (newFilters: TravelFiltersState) => {
      setFilters(newFilters);
      setPage(1);
      updateURL(newFilters, 1, limit);
    },
    [updateURL, limit]
  );

  // Limpar filtros
  const handleClearFilters = useCallback(() => {
    const clearedFilters: TravelFiltersState = {
      sortBy: "departureDate",
      sortOrder: "desc",
    };
    setFilters(clearedFilters);
    setPage(1);
    updateURL(clearedFilters, 1, limit);
  }, [updateURL, limit]);

  // Atualizar página
  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
      updateURL(filters, newPage, limit);
    },
    [filters, limit, updateURL]
  );

  // Atualizar limite
  const handleLimitChange = useCallback(
    (newLimit: number) => {
      setLimit(newLimit);
      setPage(1);
      updateURL(filters, 1, newLimit);
    },
    [filters, updateURL]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Minhas Viagens</h2>
          <p className="text-gray-600">Gerencie todos os seus orçamentos e viagens confirmadas.</p>
        </div>
      </div>

      <TravelFilters filters={filters} onFilterChange={handleFilterChange} onClearFilters={handleClearFilters} />

      <TravelTable
        travels={travels}
        pagination={pagination}
        isLoading={isLoading}
        error={error ? "Erro ao carregar viagens" : null}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />
    </div>
  );
}

export default function TravelsPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <TravelsPageContent />
    </Suspense>
  );
}
