/**
 * Travel Validation Schemas
 */

import { z } from 'zod';
import { validateReturnDate, validateMoneyAmount } from './validators';
import { isValidIATAFormat } from '@/data/brazilian-cities';

/**
 * Status de viagem válidos
 */
export const travelStatusEnum = z.enum([
  'orcamento',
  'aguardando_pagamento',
  'confirmada',
  'em_andamento',
  'finalizada',
  'cancelada',
]);

/**
 * Moedas válidas
 */
export const currencyEnum = z.enum(['BRL', 'USD', 'EUR', 'ARS']);

/**
 * Schema base para viagem
 */
const baseTravelSchema = {
  title: z
    .string({ required_error: 'Título é obrigatório' })
    .min(3, 'Título deve ter no mínimo 3 caracteres')
    .max(255, 'Título muito longo'),

  description: z
    .string()
    .max(1000, 'Descrição muito longa')
    .optional(),

  destination: z
    .string({ required_error: 'Cidade de destino é obrigatória' })
    .min(2, 'Cidade de destino deve ter no mínimo 2 caracteres')
    .max(255, 'Cidade de destino muito longa')
    .refine(
      (val) => isValidIATAFormat(val),
      'Formato inválido. Use: CÓDIGO - Cidade/Estado (ex: GIG - Rio de Janeiro/RJ)'
    ),

  departureCity: z
    .string({ required_error: 'Cidade de partida é obrigatória' })
    .min(2, 'Cidade de partida deve ter no mínimo 2 caracteres')
    .max(255, 'Cidade de partida muito longa')
    .refine(
      (val) => isValidIATAFormat(val),
      'Formato inválido. Use: CÓDIGO - Cidade/Estado (ex: GRU - São Paulo/SP)'
    ),

  departureDate: z
    .string()
    .or(z.date())
    .refine(
      (val) => {
        const date = typeof val === 'string' ? new Date(val) : val;
        return !isNaN(date.getTime());
      },
      'Data de partida inválida'
    ),

  returnDate: z
    .string()
    .or(z.date())
    .optional(),

  totalValue: z
    .number()
    .nonnegative('Valor total não pode ser negativo')
    .refine(validateMoneyAmount, 'Valor deve ter no máximo 2 casas decimais')
    .optional(),

  paidValue: z
    .number()
    .nonnegative('Valor pago não pode ser negativo')
    .refine(validateMoneyAmount, 'Valor deve ter no máximo 2 casas decimais')
    .default(0),

  currency: currencyEnum.default('BRL'),

  status: travelStatusEnum.default('orcamento'),

  isInternational: z.boolean().default(false),

  passengerCount: z
    .number()
    .int('Número de passageiros deve ser um inteiro')
    .positive('Número de passageiros deve ser positivo')
    .max(999, 'Número de passageiros muito alto')
    .default(1),

  notes: z
    .string()
    .max(2000, 'Notas muito longas')
    .optional(),

  internalNotes: z
    .string()
    .max(2000, 'Notas internas muito longas')
    .optional(),
};

/**
 * Schema para criação de viagem
 */
export const travelCreateSchema = z
  .object({
    ...baseTravelSchema,
    customerId: z
      .string({ required_error: 'ID do cliente é obrigatório' })
      .uuid('ID do cliente inválido'),
  })
  .refine(
    (data) => {
      // Se returnDate fornecido, deve ser após departureDate
      if (!data.returnDate) return true;

      const departure = typeof data.departureDate === 'string'
        ? new Date(data.departureDate)
        : data.departureDate;

      const returnD = typeof data.returnDate === 'string'
        ? new Date(data.returnDate)
        : data.returnDate;

      return validateReturnDate(returnD, departure);
    },
    {
      message: 'Data de retorno deve ser após a data de partida',
      path: ['returnDate'],
    }
  )
  .refine(
    (data) => {
      // paidValue não pode ser maior que totalValue
      if (!data.totalValue) return true;
      return data.paidValue <= data.totalValue;
    },
    {
      message: 'Valor pago não pode ser maior que o valor total',
      path: ['paidValue'],
    }
  );

/**
 * Schema para atualização de viagem
 */
export const travelUpdateSchema = z
  .object({
    ...baseTravelSchema,
    customerId: z.string().uuid('ID do cliente inválido').optional(),
  })
  .partial()
  .refine(
    (data) => {
      // Se ambos fornecidos, returnDate deve ser após departureDate
      if (!data.returnDate || !data.departureDate) return true;

      const departure = typeof data.departureDate === 'string'
        ? new Date(data.departureDate)
        : data.departureDate;

      const returnD = typeof data.returnDate === 'string'
        ? new Date(data.returnDate)
        : data.returnDate;

      return validateReturnDate(returnD, departure);
    },
    {
      message: 'Data de retorno deve ser após a data de partida',
      path: ['returnDate'],
    }
  )
  .refine(
    (data) => {
      // Se ambos fornecidos, paidValue não pode ser maior que totalValue
      if (data.totalValue === undefined || data.paidValue === undefined) return true;
      return data.paidValue <= data.totalValue;
    },
    {
      message: 'Valor pago não pode ser maior que o valor total',
      path: ['paidValue'],
    }
  );

/**
 * Schema para viagem completa (incluindo ID e relações)
 */
export const travelSchema = z.object({
  id: z.string().uuid('ID inválido'),
  ...baseTravelSchema,
  customerId: z.string().uuid('ID do cliente inválido'),
  agentId: z.string().uuid('ID do agente inválido'),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
});

/**
 * Schema para filtros de viagem
 */
export const travelFilterSchema = z.object({
  status: travelStatusEnum.optional(),
  customerId: z.string().uuid().optional(),
  agentId: z.string().uuid().optional(),
  destination: z.string().optional(),
  departureCity: z.string().optional(),
  isInternational: z.boolean().optional(),
  departureDateFrom: z.string().or(z.date()).optional(),
  departureDateTo: z.string().or(z.date()).optional(),
  minValue: z.number().nonnegative().optional(),
  maxValue: z.number().nonnegative().optional(),
  search: z.string().optional(), // Busca geral por título/destino
});

/**
 * Type inference dos schemas
 */
export type TravelCreateInput = z.infer<typeof travelCreateSchema>;
export type TravelUpdateInput = z.infer<typeof travelUpdateSchema>;
export type TravelData = z.infer<typeof travelSchema>;
export type TravelFilter = z.infer<typeof travelFilterSchema>;
export type TravelStatus = z.infer<typeof travelStatusEnum>;
export type Currency = z.infer<typeof currencyEnum>;
