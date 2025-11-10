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

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const documentNumber = searchParams.get('documentNumber');
    const excludeId = searchParams.get('excludeId'); // Para edição

    const duplicates: Array<{
      field: string;
      value: string;
      customer: {
        id: string;
        firstName: string;
        lastName: string;
        email: string | null;
        documentNumber: string | null;
      };
    }> = [];

    // Verificar email de cliente
    if (email) {
      const existingByEmail = await prisma.customer.findFirst({
        where: {
          email: {
            equals: email,
            mode: 'insensitive',
          },
          isActive: true,
          createdById: userId,
          ...(excludeId && { id: { not: excludeId } }),
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          documentNumber: true,
        },
      });

      if (existingByEmail) {
        duplicates.push({
          field: 'email',
          value: email,
          customer: existingByEmail,
        });
      }
    }

    // Verificar CPF/CNPJ de cliente
    if (documentNumber) {
      const cleanDoc = documentNumber.replace(/\D/g, '');
      const existingByDocument = await prisma.customer.findFirst({
        where: {
          documentNumber: cleanDoc,
          isActive: true,
          createdById: userId,
          ...(excludeId && { id: { not: excludeId } }),
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          documentNumber: true,
        },
      });

      if (existingByDocument && !duplicates.find(d => d.customer.id === existingByDocument.id)) {
        duplicates.push({
          field: 'documentNumber',
          value: cleanDoc,
          customer: existingByDocument,
        });
      }
    }

    return NextResponse.json({
      duplicates,
    }, { status: 200 });
  } catch (error) {
    return handleAPIError(error);
  }
}
