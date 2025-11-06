// GET para verificar duplicatas de clientes e usuários

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { handleAPIError } from '@/lib/error-handler';
import { AuthenticationError } from '@/lib/errors';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      throw new AuthenticationError('Você precisa estar autenticado');
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'customer' | 'user'
    const email = searchParams.get('email');
    const documentNumber = searchParams.get('documentNumber');
    const excludeId = searchParams.get('excludeId'); // Para edição

    if (!type) {
      return NextResponse.json(
        { error: 'Parâmetro "type" é obrigatório' },
        { status: 400 }
      );
    }

    const duplicates: {
      email?: Array<{ id: string; firstName: string; lastName: string; email: string }>;
      documentNumber?: Array<{ id: string; firstName: string; lastName: string; documentNumber: string }>;
    } = {};

    if (type === 'customer') {
      // Verificar email de cliente
      if (email) {
        const emailDuplicates = await prisma.customer.findMany({
          where: {
            email: {
              equals: email,
              mode: 'insensitive'
            },
            ...(excludeId && { id: { not: excludeId } })
          },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          },
          take: 5
        });

        if (emailDuplicates.length > 0) {
          duplicates.email = emailDuplicates.map(c => ({
            id: c.id,
            firstName: c.firstName,
            lastName: c.lastName,
            email: c.email || ''
          }));
        }
      }

      // Verificar CPF/CNPJ de cliente
      if (documentNumber) {
        const docDuplicates = await prisma.customer.findMany({
          where: {
            documentNumber,
            ...(excludeId && { id: { not: excludeId } })
          },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            documentNumber: true
          },
          take: 5
        });

        if (docDuplicates.length > 0) {
          duplicates.documentNumber = docDuplicates.map(c => ({
            id: c.id,
            firstName: c.firstName,
            lastName: c.lastName,
            documentNumber: c.documentNumber || ''
          }));
        }
      }
    } else if (type === 'user') {
      // Verificar email de usuário
      if (email) {
        const emailDuplicates = await prisma.user.findMany({
          where: {
            email: {
              equals: email,
              mode: 'insensitive'
            },
            ...(excludeId && { id: { not: excludeId } })
          },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          },
          take: 5
        });

        if (emailDuplicates.length > 0) {
          duplicates.email = emailDuplicates.map(u => ({
            id: u.id,
            firstName: u.firstName,
            lastName: u.lastName,
            email: u.email
          }));
        }
      }
    }

    const hasDuplicates = Object.keys(duplicates).length > 0;

    return NextResponse.json({
      hasDuplicates,
      duplicates: hasDuplicates ? duplicates : null
    }, { status: 200 });
  } catch (error) {
    return handleAPIError(error);
  }
}
