import { Decimal } from '@prisma/client/runtime/library';
import prisma from './prisma';
import { travel_status } from '@prisma/client';

/**
 * Calcula o saldo de uma viagem (valor total - valor pago)
 */
export function calculateBalance(totalValue: Decimal | number, paidValue: Decimal | number): number {
  const total = typeof totalValue === 'number' ? totalValue : Number(totalValue);
  const paid = typeof paidValue === 'number' ? paidValue : Number(paidValue);

  return Math.max(0, total - paid);
}

/**
 * Determina o status apropriado da viagem baseado nos pagamentos
 */
export function determineTravelStatus(totalValue: Decimal | number, paidValue: Decimal | number): travel_status {
  const total = typeof totalValue === 'number' ? totalValue : Number(totalValue);
  const paid = typeof paidValue === 'number' ? paidValue : Number(paidValue);

  if (total === 0) {
    return 'orcamento';
  }

  if (paid >= total) {
    return 'confirmada';
  }

  if (paid > 0 && paid < total) {
    return 'aguardando_pagamento';
  }

  return 'orcamento';
}

/**
 * Atualiza o status de uma viagem baseado no valor pago
 */
export async function updateTravelStatusBasedOnPayments(travelId: string): Promise<void> {
  try {
    const travel = await prisma.travel.findUnique({
      where: { id: travelId },
      select: {
        totalValue: true,
        paidValue: true,
        status: true
      }
    });

    if (!travel) {
      throw new Error('Viagem não encontrada');
    }

    // Não atualizar status se a viagem já estiver em andamento, finalizada ou cancelada
    if (['em_andamento', 'finalizada', 'cancelada'].includes(travel.status || '')) {
      return;
    }

    const newStatus = determineTravelStatus(
      travel.totalValue || 0,
      travel.paidValue || 0
    );

    // Atualizar apenas se o status mudou
    if (newStatus !== travel.status) {
      await prisma.travel.update({
        where: { id: travelId },
        data: { status: newStatus }
      });
    }
  } catch (error) {
    console.error('Erro ao atualizar status da viagem:', error);
    throw error;
  }
}

/**
 * Calcula juros e multas para pagamentos atrasados
 *
 * @param amount - Valor original
 * @param dueDate - Data de vencimento
 * @param interestRate - Taxa de juros mensal (em decimal, ex: 0.01 = 1%)
 * @param penaltyRate - Taxa de multa (em decimal, ex: 0.02 = 2%)
 * @returns Valor total com juros e multas
 */
export function calculateLateFees(
  amount: Decimal | number,
  dueDate: Date,
  interestRate: number = 0.01,
  penaltyRate: number = 0.02
): number {
  const baseAmount = typeof amount === 'number' ? amount : Number(amount);
  const today = new Date();

  // Se não está vencido, retorna o valor original
  if (dueDate >= today) {
    return baseAmount;
  }

  // Calcular dias de atraso
  const daysLate = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

  // Calcular multa (aplicada uma vez)
  const penalty = baseAmount * penaltyRate;

  // Calcular juros (proporcional aos meses de atraso)
  const monthsLate = daysLate / 30;
  const interest = baseAmount * interestRate * monthsLate;

  return baseAmount + penalty + interest;
}

/**
 * Aplica desconto a um valor
 *
 * @param amount - Valor original
 * @param discountType - Tipo de desconto ('percentage' ou 'fixed')
 * @param discountValue - Valor do desconto (porcentagem ou valor fixo)
 * @returns Valor com desconto aplicado
 */
export function applyDiscount(
  amount: Decimal | number,
  discountType: 'percentage' | 'fixed',
  discountValue: number
): number {
  const baseAmount = typeof amount === 'number' ? amount : Number(amount);

  if (discountType === 'percentage') {
    const discountAmount = baseAmount * (discountValue / 100);
    return Math.max(0, baseAmount - discountAmount);
  }

  // Fixed discount
  return Math.max(0, baseAmount - discountValue);
}

/**
 * Converte valor entre moedas
 *
 * @param amount - Valor a ser convertido
 * @param fromCurrency - Moeda de origem
 * @param toCurrency - Moeda de destino
 * @param exchangeRates - Objeto com taxas de câmbio (base: BRL)
 * @returns Valor convertido
 */
export function convertCurrency(
  amount: Decimal | number,
  fromCurrency: string,
  toCurrency: string,
  exchangeRates: Record<string, number>
): number {
  const baseAmount = typeof amount === 'number' ? amount : Number(amount);

  // Se as moedas são iguais, retorna o valor original
  if (fromCurrency === toCurrency) {
    return baseAmount;
  }

  // Converter para BRL primeiro (moeda base)
  const amountInBRL = fromCurrency === 'BRL'
    ? baseAmount
    : baseAmount / (exchangeRates[fromCurrency] || 1);

  // Converter de BRL para a moeda de destino
  const convertedAmount = toCurrency === 'BRL'
    ? amountInBRL
    : amountInBRL * (exchangeRates[toCurrency] || 1);

  return convertedAmount;
}

/**
 * Taxas de câmbio padrão (base: BRL)
 * Nota: Em produção, essas taxas devem vir de uma API externa
 */
export const DEFAULT_EXCHANGE_RATES: Record<string, number> = {
  'BRL': 1,
  'USD': 5.0,
  'EUR': 5.5,
  'ARS': 0.02
};

/**
 * Calcula o valor total de uma lista de itens
 */
export function calculateTotal(items: Array<{ amount: Decimal | number }>): number {
  return items.reduce((sum, item) => {
    const amount = typeof item.amount === 'number' ? item.amount : Number(item.amount);
    return sum + amount;
  }, 0);
}

/**
 * Calcula a porcentagem paga de uma viagem
 */
export function calculatePaymentPercentage(totalValue: Decimal | number, paidValue: Decimal | number): number {
  const total = typeof totalValue === 'number' ? totalValue : Number(totalValue);
  const paid = typeof paidValue === 'number' ? paidValue : Number(paidValue);

  if (total === 0) return 0;

  return Math.min(100, (paid / total) * 100);
}

/**
 * Formata valor monetário para exibição
 */
export function formatCurrency(amount: Decimal | number, currency: string = 'BRL'): string {
  const value = typeof amount === 'number' ? amount : Number(amount);

  const currencyMap: Record<string, { locale: string; currency: string }> = {
    'BRL': { locale: 'pt-BR', currency: 'BRL' },
    'USD': { locale: 'en-US', currency: 'USD' },
    'EUR': { locale: 'de-DE', currency: 'EUR' },
    'ARS': { locale: 'es-AR', currency: 'ARS' }
  };

  const config = currencyMap[currency] || currencyMap['BRL'];

  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency
  }).format(value);
}
