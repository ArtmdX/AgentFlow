import { Customer } from '@prisma/client';
import { headers } from 'next/headers';

// URL base da sua API. É uma boa prática usar variáveis de ambiente.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function getCustomers(): Promise<Customer[]> {
  try {
    const requestHeaders = await headers();
    // Usamos 'no-cache' para garantir que os dados sejam sempre frescos ao navegar.
    const response = await fetch(`${API_BASE_URL}/customers`, {
      cache: 'no-cache',
      headers: requestHeaders
    });

    if (!response.ok) {
      // Se a resposta da API não for bem-sucedida, lançamos um erro.
      console.error('Erro ao buscar clientes:', response.statusText);
      throw new Error('Falha ao buscar os dados dos clientes.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro no serviço de clientes:', error);
    return [];
  }
}

// Futuramente, adicionar outras funções aqui:
// export async function createCustomer(customerData: Omit<Customer, 'id'>) { ... }
// export async function deleteCustomer(customerId: string) { ... }
