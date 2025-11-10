import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Payment {
  id: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: string;
  currency: string;
  referenceNumber?: string;
  notes?: string;
  travelId: string;
  createdById: string;
}

interface PaymentsResponse {
  payments: Payment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface PaymentFilters {
  page?: number;
  limit?: number;
  travelId?: string;
  customerId?: string;
  paymentMethod?: string;
  startDate?: string;
  endDate?: string;
}

// Função para buscar payments
async function fetchPayments(filters: PaymentFilters): Promise<PaymentsResponse> {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.set(key, value.toString());
    }
  });

  const response = await fetch(`/api/payments?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Erro ao carregar pagamentos');
  }

  return response.json();
}

// Hook para buscar payments com paginação e filtros
export function usePayments(filters: PaymentFilters) {
  return useQuery({
    queryKey: ['payments', filters],
    queryFn: () => fetchPayments(filters),
    staleTime: 30 * 1000, // 30 segundos
  });
}

// Hook para criar payment
export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao criar pagamento');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['travels'] });
    },
  });
}

// Hook para atualizar payment
export function useUpdatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, unknown> }) => {
      const response = await fetch(`/api/payments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao atualizar pagamento');
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['payment', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['travels'] });
    },
  });
}

// Hook para deletar payment
export function useDeletePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/payments/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao deletar pagamento');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['travels'] });
    },
  });
}
