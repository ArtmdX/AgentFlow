import { z } from 'zod';

// Validação para criação de usuário (admin criando novos usuários)
export const createUserSchema = z.object({
  firstName: z.string()
    .min(2, 'Nome deve ter no mínimo 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim(),

  lastName: z.string()
    .min(2, 'Sobrenome deve ter no mínimo 2 caracteres')
    .max(100, 'Sobrenome deve ter no máximo 100 caracteres')
    .trim(),

  email: z.string()
    .email('Email inválido')
    .max(255, 'Email deve ter no máximo 255 caracteres')
    .toLowerCase()
    .trim(),

  password: z.string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .max(100, 'Senha deve ter no máximo 100 caracteres'),

  phone: z.string()
    .max(20, 'Telefone deve ter no máximo 20 caracteres')
    .optional()
    .nullable(),

  role: z.enum(['admin', 'manager', 'agent'], {
    errorMap: () => ({ message: 'Role inválido. Deve ser: admin, manager ou agent' })
  }).default('agent'),

  isActive: z.boolean().default(true)
});

// Validação para atualização de usuário
export const updateUserSchema = z.object({
  firstName: z.string()
    .min(2, 'Nome deve ter no mínimo 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim()
    .optional(),

  lastName: z.string()
    .min(2, 'Sobrenome deve ter no mínimo 2 caracteres')
    .max(100, 'Sobrenome deve ter no máximo 100 caracteres')
    .trim()
    .optional(),

  email: z.string()
    .email('Email inválido')
    .max(255, 'Email deve ter no máximo 255 caracteres')
    .toLowerCase()
    .trim()
    .optional(),

  phone: z.string()
    .max(20, 'Telefone deve ter no máximo 20 caracteres')
    .optional()
    .nullable(),

  role: z.enum(['admin', 'manager', 'agent'], {
    errorMap: () => ({ message: 'Role inválido. Deve ser: admin, manager ou agent' })
  }).optional(),

  isActive: z.boolean().optional()
});

// Validação para atualização de perfil (usuário editando próprios dados)
export const updateProfileSchema = z.object({
  firstName: z.string()
    .min(2, 'Nome deve ter no mínimo 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim()
    .optional(),

  lastName: z.string()
    .min(2, 'Sobrenome deve ter no mínimo 2 caracteres')
    .max(100, 'Sobrenome deve ter no máximo 100 caracteres')
    .trim()
    .optional(),

  phone: z.string()
    .max(20, 'Telefone deve ter no máximo 20 caracteres')
    .optional()
    .nullable()
});

// Validação para alteração de senha (autenticada)
export const changePasswordSchema = z.object({
  currentPassword: z.string()
    .min(1, 'Senha atual é obrigatória'),

  newPassword: z.string()
    .min(6, 'Nova senha deve ter no mínimo 6 caracteres')
    .max(100, 'Nova senha deve ter no máximo 100 caracteres'),

  confirmPassword: z.string()
    .min(1, 'Confirmação de senha é obrigatória')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword']
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: 'A nova senha deve ser diferente da senha atual',
  path: ['newPassword']
});

// Validação para solicitar recuperação de senha
export const forgotPasswordSchema = z.object({
  email: z.string()
    .email('Email inválido')
    .toLowerCase()
    .trim()
});

// Validação para redefinir senha (com token)
export const resetPasswordSchema = z.object({
  token: z.string()
    .min(1, 'Token é obrigatório'),

  password: z.string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .max(100, 'Senha deve ter no máximo 100 caracteres'),

  confirmPassword: z.string()
    .min(1, 'Confirmação de senha é obrigatória')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword']
});

// Validação para reset de senha por admin (sem senha atual)
export const adminResetPasswordSchema = z.object({
  newPassword: z.string()
    .min(6, 'Nova senha deve ter no mínimo 6 caracteres')
    .max(100, 'Nova senha deve ter no máximo 100 caracteres'),

  confirmPassword: z.string()
    .min(1, 'Confirmação de senha é obrigatória')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword']
});

// Tipos inferidos dos schemas
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type AdminResetPasswordInput = z.infer<typeof adminResetPasswordSchema>;
