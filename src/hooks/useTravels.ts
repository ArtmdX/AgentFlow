import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Prisma } from '@prisma/client';

type TravelWithCustomer = Prisma.TravelGetPayload<{
  include: { customer: { select: { firstName: true; lastName: true } } };
}>;

interface TravelsResponse {
  travels: TravelWithCustomer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface TravelFilters {
  page?: number;
  limit?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
  destination?: string;
  customer?: string;
  sortBy?: string;
  sortOrder?: string;
}

// Função para buscar travels
async function fetchTravels(filters: TravelFilters): Promise<TravelsResponse> {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.set(key, value.toString());
    }
  });

  const response = await fetch(`/api/travels?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Erro ao carregar viagens');
  }

  return response.json();
}

// Hook para buscar travels com paginação e filtros
export function useTravels(filters: TravelFilters) {
  return useQuery({
    queryKey: ['travels', filters],
    queryFn: () => fetchTravels(filters),
    staleTime: 30 * 1000, // 30 segundos
  });
}

// Hook para criar travel
export function useCreateTravel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const response = await fetch('/api/travels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao criar viagem');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidar todas as queries de travels para refetch
      queryClient.invalidateQueries({ queryKey: ['travels'] });
    },
  });
}

// Hook para atualizar travel
export function useUpdateTravel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, unknown> }) => {
      const response = await fetch(`/api/travels/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao atualizar viagem');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      // Invalidar queries de travels e a travel específica
      queryClient.invalidateQueries({ queryKey: ['travels'] });
      queryClient.invalidateQueries({ queryKey: ['travel', variables.id] });
    },
  });
}

// Hook para deletar travel
export function useDeleteTravel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/travels/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao deletar viagem');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['travels'] });
    },
  });
}
