import { Customer } from '@prisma/client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function createCustomer(customerData: Omit<Customer, 'id'>): Promise<Customer | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/customers`, {
      method: 'POST',
      headers: {
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

export async function updateCustomer(customerId: string, customerData: Partial<Customer>, override?: boolean): Promise<Customer | null> {
  try {
    const url = override
      ? `${API_BASE_URL}/customers/${customerId}?override=true`
      : `${API_BASE_URL}/customers/${customerId}`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(customerData)
    });

    if (!response.ok) {
      console.error('Erro ao atualizar cliente:', response.statusText);
      throw new Error('Falha ao atualizar o cliente.');
    }

    return response.json();
  } catch (error) {
    console.error('Erro no serviço de atualização de cliente:', error);
    return null;
  }
}

export async function deleteCustomer(customerId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/customers/${customerId}`, {
      method: 'DELETE'
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
