/**
 * Customer Validation Schemas
 *
 * Schemas simplificados alinhados com o modelo Prisma atual
 */

import { z } from 'zod';
import { validateCPFOrCNPJ } from './validators';

/**
 * Schema base para cliente (campos principais)
 */
const baseCustomerSchema = {
  firstName: z
    .string({ required_error: 'Nome é obrigatório' })
    .min(2, 'Nome deve ter no mínimo 2 caracteres')
    .max(100, 'Nome muito longo'),

  lastName: z
    .string({ required_error: 'Sobrenome é obrigatório' })
    .min(2, 'Sobrenome deve ter no mínimo 2 caracteres')
    .max(100, 'Sobrenome muito longo'),

  email: z
    .string()
    .email('Email inválido')
    .toLowerCase()
    .trim()
    .optional(),

  phone: z
    .string()
    .max(20, 'Telefone muito longo')
    .optional(),

  documentNumber: z
    .string()
    .max(50, 'Número de documento muito longo')
    .optional()
    .refine(
      (val) => {
        // Se não foi fornecido, é válido
        if (!val || val.trim() === '') return true;
        // Valida CPF ou CNPJ
        return validateCPFOrCNPJ(val);
      },
      {
        message: 'CPF ou CNPJ inválido',
      }
    ),

  birthDate: z
    .string()
    .or(z.date())
    .optional(),

  notes: z
    .string()
    .max(2000, 'Notas muito longas')
    .optional(),
};

/**
 * Schema para criação de cliente
 */
export const customerCreateSchema = z.object(baseCustomerSchema);

/**
 * Schema para atualização de cliente
 */
export const customerUpdateSchema = z.object(baseCustomerSchema).partial();

/**
 * Type inference dos schemas
 */
export type CustomerCreateInput = z.infer<typeof customerCreateSchema>;
export type CustomerUpdateInput = z.infer<typeof customerUpdateSchema>;
