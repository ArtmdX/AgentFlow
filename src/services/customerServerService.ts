import { Customer } from "@prisma/client";
import { headers } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface CustomerStats {
  totalCustomers: number;
  totalTravels: number;
  totalRevenue: number;
}

export interface CustomersWithStats {
  customers: Customer[];
  stats: CustomerStats;
}

export async function getCustomers(): Promise<CustomersWithStats> {
  try {
    const requestHeaders = await headers();
    const response = await fetch(`${API_BASE_URL}/customers`, {
      cache: "no-cache",
      headers: requestHeaders,
    });

    if (!response.ok) {
      console.error("Erro ao buscar clientes:", response.statusText);
      throw new Error("Falha ao buscar os dados dos clientes.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro no serviço de clientes:", error);
    return {
      customers: [],
      stats: {
        totalCustomers: 0,
        totalTravels: 0,
        totalRevenue: 0,
      },
    };
  }
}

export async function getCustomerById(id: string | string[]): Promise<Customer | null> {
  try {
    const requestHeaders = await headers();
    const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
      headers: requestHeaders,
    });

    if (!response.ok) {
      console.error("Erro ao buscar cliente:", response.statusText);
      return null;
    }

    const customer = await response.json();
    return customer;
  } catch (error) {
    console.error("Erro no serviço de busca de cliente:", error);
    return null;
  }
}
