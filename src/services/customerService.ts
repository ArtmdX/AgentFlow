import { Customer } from '@prisma/client';
import { headers } from 'next/headers';

// URL base da sua API. É uma boa prática usar variáveis de ambiente.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function getCustomers(): Promise<Customer[]> {
  try {
    console.log(API_BASE_URL);
    const requestHeaders = await headers();
    const response = await fetch(`${API_BASE_URL}/customers`, {
      cache: 'no-cache',
      headers: requestHeaders
    });

    if (!response.ok) {
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

export async function createCustomer(customerData: Omit<Customer, 'id'>): Promise<Customer | null> {
  try {
    const requestHeaders = await headers();
    const response = await fetch(`${API_BASE_URL}/customers`, {
      method: 'POST',
      headers: {
        ...requestHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(customerData)
    });

    if (!response.ok) {
      console.error('Erro ao criar cliente:', response.statusText);
      throw new Error('Falha ao criar o cliente.');
    }

    const newCustomer = await response.json();
    return newCustomer;
  } catch (error) {
    console.error('Erro no serviço de criação de cliente:', error);
    return null;
  }
}
export async function getCustomerById(id: string): Promise<Customer | null> {
  try {
    const requestHeaders = await headers();
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      headers: requestHeaders
    });

    if (!response.ok) {
      console.error('Erro ao buscar cliente:', response.statusText);
      return null;
    }

    const customer = await response.json();
    return customer;
  } catch (error) {
    console.error('Erro no serviço de busca de cliente:', error);
    return null;
  }
}

export async function updateCustomer(customerId: string, customerData: Partial<Customer>): Promise<Customer | null> {
  try {
    const requestHeaders = await headers();
    const response = await fetch(`${API_BASE_URL}/customers/${customerId}`, {
      method: 'PUT',
      headers: {
        ...requestHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(customerData)
    });

    if (!response.ok) {
      console.error('Erro ao atualizar cliente:', response.statusText);
      throw new Error('Falha ao atualizar o cliente.');
    }

    const updatedCustomer = await response.json();
    return updatedCustomer;
  } catch (error) {
    console.error('Erro no serviço de atualização de cliente:', error);
    return null;
  }
}

export async function deleteCustomer(customerId: string) {
  try {
    const requestHeaders = await headers();
    const response = await fetch(`${API_BASE_URL}/customers/${customerId}`, {
      method: 'DELETE',
      headers: requestHeaders
    });

    if (!response.ok) {
      console.error('Erro ao deletar cliente:', response.statusText);
      throw new Error('Falha ao deletar o cliente.');
    }

    return true;
  } catch (error) {
    console.error('Erro no serviço de deleção de cliente:', error);
    return false;
  }
}
