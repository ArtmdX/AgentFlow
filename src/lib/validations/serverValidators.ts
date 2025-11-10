/**
 * Validadores Server-Side
 *
 * Funções de validação que requerem acesso ao banco de dados
 * ATENÇÃO: Este arquivo NUNCA deve ser importado em componentes client-side
 */

import prisma from '@/lib/prisma';

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
