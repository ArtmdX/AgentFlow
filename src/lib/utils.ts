// Funções utilitárias
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency = "BRL") {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).format(value);
}

export function formatDate(date: Date | string | null | undefined): string | null {
  if (!date) return null;
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatTravelStatus(status: string): string {
  const statusMap: Record<string, string> = {
    pending: "Pendente",
    confirmada: "Confirmada",
    aguardando_pagamento: "Aguardando Pagamento",
    em_andamento: "Em Andamento",
    finalizada: "Concluída",
    cancelada: "Cancelada",
    orcamento: "Orçamento",
  };
  return statusMap[status] || status;
}

/**
 * Remove propriedades undefined ou strings vazias de um objeto
 */
export function cleanObject<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== '') {
      (acc as Record<string, unknown>)[key] = value;
    }
    return acc;
  }, {} as Partial<T>);
}

/**
 * Converte um objeto em URLSearchParams, removendo valores vazios
 */
export function objectToSearchParams(obj: Record<string, unknown>): URLSearchParams {
  const params = new URLSearchParams();

  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });

  return params;
}
