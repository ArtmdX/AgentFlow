import { Payment } from '@prisma/client';

export interface PaymentCreateData {
  amount: number;
  currency?: 'BRL' | 'USD' | 'EUR' | 'ARS';
  paymentMethod: 'cash' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'pix' | 'check';
  paymentDate: string;
  referenceNumber?: string;
  notes?: string;
}

export interface PaymentUpdateData {
  amount?: number;
  currency?: 'BRL' | 'USD' | 'EUR' | 'ARS';
  paymentMethod?: 'cash' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'pix' | 'check';
  paymentDate?: string;
  referenceNumber?: string;
  notes?: string;
}

export interface PaymentWithDetails extends Payment {
  createdBy: {
    firstName: string;
    lastName: string;
  };
  travel?: {
    id: string;
    title: string;
    customer: {
      firstName: string;
      lastName: string;
    };
  };
}

// Listar pagamentos de uma viagem
export async function getPaymentsByTravel(travelId: string): Promise<PaymentWithDetails[]> {
  const response = await fetch(`/api/travels/${travelId}/payments`);

  if (!response.ok) {
    const errorResult = await response.json();
    throw new Error(errorResult.message || 'Erro ao carregar pagamentos');
  }

  return response.json();
}

// Criar novo pagamento
export async function createPayment(travelId: string, paymentData: PaymentCreateData): Promise<PaymentWithDetails> {
  const response = await fetch(`/api/travels/${travelId}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(paymentData)
  });

  if (!response.ok) {
    const errorResult = await response.json();
    throw new Error(errorResult.message || 'Erro ao criar pagamento');
  }

  return response.json();
}

// Buscar pagamento específico
export async function getPaymentById(paymentId: string): Promise<PaymentWithDetails> {
  const response = await fetch(`/api/payments/${paymentId}`);

  if (!response.ok) {
    const errorResult = await response.json();
    throw new Error(errorResult.message || 'Erro ao carregar pagamento');
  }

  return response.json();
}

// Atualizar pagamento
export async function updatePayment(paymentId: string, paymentData: PaymentUpdateData): Promise<PaymentWithDetails> {
  const response = await fetch(`/api/payments/${paymentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(paymentData)
  });

  if (!response.ok) {
    const errorResult = await response.json();
    throw new Error(errorResult.message || 'Erro ao atualizar pagamento');
  }

  return response.json();
}

// Excluir pagamento
export async function deletePayment(paymentId: string): Promise<void> {
  const response = await fetch(`/api/payments/${paymentId}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    const errorResult = await response.json();
    throw new Error(errorResult.message || 'Erro ao excluir pagamento');
  }
}

// Utilitários para formatação
export function formatPaymentMethod(method: string): string {
  const methods: Record<string, string> = {
    'cash': 'Dinheiro',
    'credit_card': 'Cartão de Crédito',
    'debit_card': 'Cartão de Débito',
    'bank_transfer': 'Transferência Bancária',
    'pix': 'PIX',
    'check': 'Cheque'
  };
  return methods[method] || method;
}

export function formatCurrency(value: number, currency = 'BRL'): string {
  const currencyMap: Record<string, string> = {
    'BRL': 'pt-BR',
    'USD': 'en-US',
    'EUR': 'de-DE',
    'ARS': 'es-AR'
  };

  return new Intl.NumberFormat(currencyMap[currency] || 'pt-BR', {
    style: 'currency',
    currency
  }).format(value);
}