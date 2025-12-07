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

// Validação para criação de pagamento
export const paymentCreateSchema = z.object({
  travelId: z.string().uuid('ID da viagem inválido'),
  amount: z.number().positive('Valor deve ser positivo'),
  currency: z.enum(['BRL', 'USD', 'EUR', 'ARS']).default('BRL'),
  paymentMethod: z.enum(['cash', 'credit_card', 'debit_card', 'bank_transfer', 'pix', 'check']),
  paymentDate: z.string().min(1, 'Data do pagamento é obrigatória'),
  referenceNumber: z.string().optional(),
  notes: z.string().optional()
});

// Validação para atualização de pagamento
export const paymentUpdateSchema = z.object({
  amount: z.number().positive('Valor deve ser positivo').optional(),
  currency: z.enum(['BRL', 'USD', 'EUR', 'ARS']).optional(),
  paymentMethod: z.enum(['cash', 'credit_card', 'debit_card', 'bank_transfer', 'pix', 'check']).optional(),
  paymentDate: z.string().optional(),
  referenceNumber: z.string().optional(),
  notes: z.string().optional()
});

// Validação para filtros de auditoria
export const auditFiltersSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  userId: z.string().uuid('ID do usuário inválido').optional(),
  activityType: z.enum(['status_change', 'payment', 'contact', 'note', 'created', 'updated']).optional(),
  entityType: z.enum(['travel', 'customer', 'payment']).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
});

export type AuditFilters = z.infer<typeof auditFiltersSchema>;

// Validação para configurações da agência
export const agencySettingsSchema = z.object({
  // Dados da agência
  agencyName: z.string().min(1, 'Nome da agência é obrigatório').max(255, 'Nome muito longo'),
  logoUrl: z.string().url('URL inválida').optional().nullable().or(z.literal('')),
  phone: z.string().max(20, 'Telefone muito longo').optional().nullable(),
  email: z.string().email('Email inválido').max(255, 'Email muito longo').optional().nullable().or(z.literal('')),
  website: z.string().url('URL inválida').max(255, 'URL muito longa').optional().nullable().or(z.literal('')),

  // Endereço
  addressStreet: z.string().max(255, 'Logradouro muito longo').optional().nullable(),
  addressNumber: z.string().max(20, 'Número muito longo').optional().nullable(),
  addressComplement: z.string().max(100, 'Complemento muito longo').optional().nullable(),
  addressNeighborhood: z.string().max(100, 'Bairro muito longo').optional().nullable(),
  addressCity: z.string().max(100, 'Cidade muito longa').optional().nullable(),
  addressState: z.string().max(50, 'Estado muito longo').optional().nullable(),
  addressZipCode: z.string().max(20, 'CEP muito longo').optional().nullable(),
  addressCountry: z.string().max(100, 'País muito longo').optional().nullable(),

  // SMTP
  smtpHost: z.string().max(255, 'Host muito longo').optional().nullable(),
  smtpPort: z.number().int('Porta deve ser um número inteiro').positive('Porta deve ser positiva').max(65535, 'Porta inválida').optional().nullable(),
  smtpUser: z.string().max(255, 'Usuário muito longo').optional().nullable(),
  smtpPassword: z.string().max(255, 'Senha muito longa').optional().nullable(),
  smtpSecure: z.boolean().optional().nullable(),
  smtpFromEmail: z.string().email('Email inválido').max(255, 'Email muito longo').optional().nullable().or(z.literal('')),
  smtpFromName: z.string().max(255, 'Nome muito longo').optional().nullable(),

  // Financeiro
  defaultCurrency: z.enum(['BRL', 'USD', 'EUR', 'ARS']).optional(),
  interestRate: z.number().min(0, 'Taxa não pode ser negativa').max(100, 'Taxa não pode exceder 100%').optional().nullable(),
  fineRate: z.number().min(0, 'Taxa não pode ser negativa').max(100, 'Taxa não pode exceder 100%').optional().nullable(),

  // Taxas de câmbio
  exchangeRates: z.object({
    USD: z.number().positive('Taxa deve ser positiva'),
    EUR: z.number().positive('Taxa deve ser positiva'),
    ARS: z.number().positive('Taxa deve ser positiva'),
  }).optional().nullable(),

  // Termos
  termsOfService: z.string().optional().nullable(),
  privacyPolicy: z.string().optional().nullable(),

  // Notificações
  notificationsEnabled: z.boolean().optional(),
  emailNotificationsEnabled: z.boolean().optional(),
});

export type AgencySettings = z.infer<typeof agencySettingsSchema>;

// Validação para teste SMTP
export const smtpTestSchema = z.object({
  smtpHost: z.string().min(1, 'Host é obrigatório'),
  smtpPort: z.number().int().positive(),
  smtpUser: z.string().min(1, 'Usuário é obrigatório'),
  smtpPassword: z.string().min(1, 'Senha é obrigatória'),
  smtpSecure: z.boolean(),
  smtpFromEmail: z.string().email('Email inválido'),
  smtpFromName: z.string().min(1, 'Nome é obrigatório'),
  testEmail: z.string().email('Email de teste inválido'),
});

export type SmtpTestData = z.infer<typeof smtpTestSchema>;
