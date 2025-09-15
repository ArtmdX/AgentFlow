import { z } from 'zod';

// Schemas de validação

// Validação para registro de usuário
export const registerSchema = z.object({
  firstName: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  lastName: z.string().min(2, 'Sobrenome deve ter no mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  phone: z.string().optional()
});

// Validação para atualização de viagem
export const travelUpdateSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(255, 'Título muito longo'),
  description: z.string().optional(),
  destination: z.string().min(1, 'Destino é obrigatório').max(255, 'Destino muito longo'),
  departureCity: z.string().min(1, 'Cidade de partida é obrigatória').max(255, 'Cidade muito longa'),
  departureDate: z.string().min(1, 'Data de partida é obrigatória'),
  returnDate: z.string().optional(),
  totalValue: z.number().positive('Valor deve ser positivo').optional(),
  paidValue: z.number().min(0, 'Valor pago não pode ser negativo').optional(),
  currency: z.enum(['BRL', 'USD', 'EUR', 'ARS']).optional(),
  status: z.enum(['orcamento', 'aguardando_pagamento', 'confirmada', 'em_andamento', 'finalizada', 'cancelada']).optional(),
  isInternational: z.boolean().optional(),
  passengerCount: z.number().int().positive('Número de passageiros deve ser positivo').optional(),
  notes: z.string().optional(),
  internalNotes: z.string().optional()
});
