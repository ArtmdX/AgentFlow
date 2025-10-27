/**
 * Validadores Customizados
 *
 * Funções de validação reutilizáveis para campos específicos
 */

import prisma from '@/lib/prisma';

/**
 * Valida CPF brasileiro
 * Algoritmo: https://www.macoratti.net/alg_cpf.htm
 */
export function validateCPF(cpf: string): boolean {
  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/\D/g, '');

  // Verifica se tem 11 dígitos
  if (cleanCPF.length !== 11) return false;

  // Verifica se todos os dígitos são iguais (ex: 111.111.111-11)
  if (/^(\d)\1+$/.test(cleanCPF)) return false;

  // Valida primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit > 9) digit = 0;
  if (digit !== parseInt(cleanCPF.charAt(9))) return false;

  // Valida segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit > 9) digit = 0;
  if (digit !== parseInt(cleanCPF.charAt(10))) return false;

  return true;
}

/**
 * Valida CNPJ brasileiro
 * Algoritmo: https://www.macoratti.net/alg_cnpj.htm
 */
export function validateCNPJ(cnpj: string): boolean {
  // Remove caracteres não numéricos
  const cleanCNPJ = cnpj.replace(/\D/g, '');

  // Verifica se tem 14 dígitos
  if (cleanCNPJ.length !== 14) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cleanCNPJ)) return false;

  // Valida primeiro dígito verificador
  let size = cleanCNPJ.length - 2;
  let numbers = cleanCNPJ.substring(0, size);
  const digits = cleanCNPJ.substring(size);
  let sum = 0;
  let pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;

  // Valida segundo dígito verificador
  size = size + 1;
  numbers = cleanCNPJ.substring(0, size);
  sum = 0;
  pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) return false;

  return true;
}

/**
 * Valida CPF ou CNPJ
 */
export function validateCPFOrCNPJ(value: string): boolean {
  const clean = value.replace(/\D/g, '');

  if (clean.length === 11) {
    return validateCPF(value);
  } else if (clean.length === 14) {
    return validateCNPJ(value);
  }

  return false;
}

/**
 * Valida formato de telefone brasileiro
 * Aceita: (11) 98765-4321, (11) 8765-4321, 11987654321, etc.
 */
export function validatePhone(phone: string): boolean {
  const cleanPhone = phone.replace(/\D/g, '');

  // Aceita: 11 dígitos (celular) ou 10 dígitos (fixo)
  if (cleanPhone.length !== 10 && cleanPhone.length !== 11) {
    return false;
  }

  // Verifica se começa com DDD válido (11-99)
  const ddd = parseInt(cleanPhone.substring(0, 2));
  if (ddd < 11 || ddd > 99) {
    return false;
  }

  // Para celular (11 dígitos), o terceiro dígito deve ser 9
  if (cleanPhone.length === 11 && cleanPhone.charAt(2) !== '9') {
    return false;
  }

  return true;
}

/**
 * Valida formato de CEP brasileiro
 * Aceita: 12345-678, 12345678
 */
export function validateCEP(cep: string): boolean {
  const cleanCEP = cep.replace(/\D/g, '');
  return cleanCEP.length === 8;
}

/**
 * Valida se email é único (async)
 * Usado em validações de criação de usuário/cliente
 */
export async function isEmailUnique(email: string, excludeId?: string): Promise<boolean> {
  try {
    // Verifica em customers
    const customerExists = await prisma.customer.findFirst({
      where: {
        email,
        ...(excludeId && { id: { not: excludeId } }),
        isActive: true,
      },
    });

    if (customerExists) return false;

    // Verifica em users
    const userExists = await prisma.user.findFirst({
      where: {
        email,
        ...(excludeId && { id: { not: excludeId } }),
      },
    });

    return !userExists;
  } catch (error) {
    console.error('Erro ao verificar email único:', error);
    return true; // Em caso de erro, permite o cadastro
  }
}

/**
 * Valida se documento (CPF/CNPJ) é único (async)
 */
export async function isDocumentUnique(documentNumber: string, excludeId?: string): Promise<boolean> {
  try {
    const cleanDocument = documentNumber.replace(/\D/g, '');

    const customerExists = await prisma.customer.findFirst({
      where: {
        documentNumber: cleanDocument,
        ...(excludeId && { id: { not: excludeId } }),
        isActive: true,
      },
    });

    return !customerExists;
  } catch (error) {
    console.error('Erro ao verificar documento único:', error);
    return true;
  }
}

/**
 * Valida se data de nascimento é válida (maior de idade, não no futuro)
 */
export function validateBirthDate(date: Date): boolean {
  const today = new Date();
  const birthDate = new Date(date);

  // Não pode ser no futuro
  if (birthDate > today) return false;

  // Não pode ser mais de 150 anos atrás
  const maxAge = new Date();
  maxAge.setFullYear(maxAge.getFullYear() - 150);
  if (birthDate < maxAge) return false;

  return true;
}

/**
 * Valida se data de partida é válida (não pode ser no passado)
 */
export function validateDepartureDate(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const departureDate = new Date(date);
  departureDate.setHours(0, 0, 0, 0);

  return departureDate >= today;
}

/**
 * Valida se data de retorno é após data de partida
 */
export function validateReturnDate(returnDate: Date, departureDate: Date): boolean {
  const departure = new Date(departureDate);
  departure.setHours(0, 0, 0, 0);

  const returnD = new Date(returnDate);
  returnD.setHours(0, 0, 0, 0);

  return returnD > departure;
}

/**
 * Valida valor monetário (positivo, máx 2 decimais)
 */
export function validateMoneyAmount(amount: number): boolean {
  if (amount < 0) return false;

  // Verifica se tem no máximo 2 casas decimais
  const decimal = amount.toString().split('.')[1];
  if (decimal && decimal.length > 2) return false;

  return true;
}

/**
 * Formata CPF: 123.456.789-10
 */
export function formatCPF(cpf: string): string {
  const clean = cpf.replace(/\D/g, '');
  if (clean.length !== 11) return cpf;
  return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Formata CNPJ: 12.345.678/0001-90
 */
export function formatCNPJ(cnpj: string): string {
  const clean = cnpj.replace(/\D/g, '');
  if (clean.length !== 14) return cnpj;
  return clean.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

/**
 * Formata telefone: (11) 98765-4321
 */
export function formatPhone(phone: string): string {
  const clean = phone.replace(/\D/g, '');

  if (clean.length === 11) {
    return clean.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (clean.length === 10) {
    return clean.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }

  return phone;
}

/**
 * Formata CEP: 12345-678
 */
export function formatCEP(cep: string): string {
  const clean = cep.replace(/\D/g, '');
  if (clean.length !== 8) return cep;
  return clean.replace(/(\d{5})(\d{3})/, '$1-$2');
}
