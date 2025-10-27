/**
 * Passenger Validation Schemas
 */

import { z } from 'zod';
import { validateCPF, validateBirthDate } from './validators';

/**
 * Schema base para passageiro
 */
const basePassengerSchema = {
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

  cpf: z
    .string()
    .optional()
    .refine(
      (val) => !val || validateCPF(val),
      'CPF inválido'
    ),

  passportNumber: z
    .string()
    .max(50, 'Número de passaporte muito longo')
    .optional(),

  birthDate: z
    .string()
    .or(z.date())
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const date = typeof val === 'string' ? new Date(val) : val;
        return validateBirthDate(date);
      },
      'Data de nascimento inválida'
    ),

  nationality: z
    .string()
    .min(2, 'Nacionalidade deve ter no mínimo 2 caracteres')
    .max(100, 'Nacionalidade muito longa')
    .optional(),

  gender: z
    .enum(['male', 'female', 'other', 'prefer_not_to_say'])
    .optional(),

  specialNeeds: z
    .string()
    .max(500, 'Descrição de necessidades especiais muito longa')
    .optional(),

  notes: z
    .string()
    .max(1000, 'Notas muito longas')
    .optional(),
};

/**
 * Schema para criação de passageiro
 */
export const passengerCreateSchema = z.object({
  ...basePassengerSchema,
  travelId: z
    .string({ required_error: 'ID da viagem é obrigatório' })
    .uuid('ID da viagem inválido'),
}).refine(
  (data) => {
    // Deve ter pelo menos CPF ou passaporte
    return data.cpf || data.passportNumber;
  },
  {
    message: 'CPF ou número de passaporte é obrigatório',
    path: ['cpf'],
  }
);

/**
 * Schema para atualização de passageiro
 */
export const passengerUpdateSchema = z.object({
  ...basePassengerSchema,
  travelId: z.string().uuid('ID da viagem inválido').optional(),
}).partial();

/**
 * Schema para passageiro completo (incluindo ID)
 */
export const passengerSchema = z.object({
  id: z.string().uuid('ID inválido'),
  ...basePassengerSchema,
  travelId: z.string().uuid('ID da viagem inválido'),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
});

/**
 * Type inference dos schemas
 */
export type PassengerCreateInput = z.infer<typeof passengerCreateSchema>;
export type PassengerUpdateInput = z.infer<typeof passengerUpdateSchema>;
export type PassengerData = z.infer<typeof passengerSchema>;
