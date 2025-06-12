import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET Database Test Endpoint
export async function GET() {
  try {
    // Tenta realizar uma operação simples no banco
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json(
      {
        status: 'success',
        message: 'Conexão com o banco de dados estabelecida com sucesso',
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao testar conexão com o banco:', error);

    return NextResponse.json(
      {
        status: 'error',
        message: 'Erro ao conectar com o banco de dados',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  } finally {
    // Garante que a conexão seja fechada
    await prisma.$disconnect();
  }
}
