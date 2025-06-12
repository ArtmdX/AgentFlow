// Funções utilitárias
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency = 'BRL') {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency
  }).format(value);
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
}
