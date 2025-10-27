/**
 * Error Handler Centralizado para AgentFlow CRM
 *
 * Funções para tratamento consistente de erros em:
 * - API Routes
 * - Server Actions
 * - Client Components
 */

import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import {
  AppError,
  ValidationError,
  NotFoundError,
  ConflictError,
  DatabaseError,
  ErrorCode,
  isAppError,
} from './errors';

/**
 * Interface para resposta de erro padronizada
 */
export interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code: ErrorCode;
    statusCode: number;
    timestamp: string;
    details?: unknown;
  };
}

/**
 * Interface para erros do Prisma
 */
interface PrismaError {
  code: string;
  meta?: {
    target?: string[];
  };
  message?: string;
}

/**
 * Mapeia erros do Prisma para AppErrors
 */
function handlePrismaError(error: PrismaError): AppError {
  // P2002: Unique constraint violation
  if (error.code === 'P2002') {
    const field = error.meta?.target?.[0] || 'campo';
    return new ConflictError(
      `Já existe um registro com este ${field}`,
      { field, code: error.code },
      ErrorCode.DUPLICATE_ENTRY
    );
  }

  // P2025: Record not found
  if (error.code === 'P2025') {
    return new NotFoundError('Registro não encontrado');
  }

  // P2003: Foreign key constraint violation
  if (error.code === 'P2003') {
    return new ValidationError(
      'Não é possível realizar esta operação devido a relacionamentos existentes',
      { code: error.code }
    );
  }

  // P2014: Relation violation
  if (error.code === 'P2014') {
    return new ConflictError(
      'Esta operação viola regras de relacionamento entre dados',
      { code: error.code }
    );
  }

  // P1001/P1002: Connection errors
  if (error.code === 'P1001' || error.code === 'P1002') {
    return new DatabaseError('Erro de conexão com o banco de dados', error as unknown as Error);
  }

  // Erro genérico do Prisma
  return new DatabaseError('Erro ao acessar o banco de dados', error as unknown as Error);
}

/**
 * Mapeia qualquer erro para um AppError
 */
export function normalizeError(error: unknown): AppError {
  // Já é um AppError
  if (isAppError(error)) {
    return error;
  }

  // Erro de validação Zod
  if (error instanceof ZodError) {
    return ValidationError.fromZodError(error);
  }

  // Erro do Prisma (verifica se tem propriedade 'code' como Prisma)
  if (
    error &&
    typeof error === 'object' &&
    'code' in error &&
    typeof (error as PrismaError).code === 'string' &&
    (error as PrismaError).code.startsWith('P')
  ) {
    return handlePrismaError(error as PrismaError);
  }

  // Error padrão do JavaScript
  if (error instanceof Error) {
    return new AppError(
      error.message || 'Erro interno do servidor',
      ErrorCode.INTERNAL_ERROR,
      500,
      false
    );
  }

  // Erro desconhecido
  return new AppError(
    'Erro desconhecido',
    ErrorCode.UNKNOWN_ERROR,
    500,
    false,
    error
  );
}

/**
 * Formata um erro para resposta de API
 */
export function formatErrorResponse(error: AppError): ErrorResponse {
  const response: ErrorResponse = {
    success: false,
    error: {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      timestamp: error.timestamp.toISOString(),
    },
  };

  if (error.details) {
    response.error.details = error.details;
  }

  return response;
}

/**
 * Handler de erro para API Routes (Next.js Route Handlers)
 * Retorna NextResponse com erro formatado
 */
export function handleAPIError(error: unknown): NextResponse<ErrorResponse> {
  const normalizedError = normalizeError(error);

  // Log do erro (apenas erros não operacionais - bugs do sistema)
  if (!normalizedError.isOperational) {
    console.error('❌ [ERRO NÃO OPERACIONAL]', {
      name: normalizedError.name,
      message: normalizedError.message,
      code: normalizedError.code,
      stack: normalizedError.stack,
      details: normalizedError.details,
    });
  } else {
    // Log simplificado para erros operacionais (esperados)
    console.log('⚠️ [ERRO OPERACIONAL]', {
      code: normalizedError.code,
      message: normalizedError.message,
    });
  }

  const response = formatErrorResponse(normalizedError);

  return NextResponse.json(response, {
    status: normalizedError.statusCode,
  });
}

/**
 * Handler de erro para Server Actions
 * Retorna objeto de erro formatado (não NextResponse)
 */
export function handleServerActionError(error: unknown): ErrorResponse {
  const normalizedError = normalizeError(error);

  // Log do erro
  if (!normalizedError.isOperational) {
    console.error('❌ [SERVER ACTION ERROR]', {
      name: normalizedError.name,
      message: normalizedError.message,
      code: normalizedError.code,
      stack: normalizedError.stack,
    });
  } else {
    console.log('⚠️ [SERVER ACTION WARNING]', {
      code: normalizedError.code,
      message: normalizedError.message,
    });
  }

  return formatErrorResponse(normalizedError);
}

/**
 * Extrai mensagem de erro user-friendly de um erro desconhecido
 * Útil para uso em componentes React
 */
export function getErrorMessage(error: unknown): string {
  const normalizedError = normalizeError(error);
  return normalizedError.message;
}

/**
 * Verifica se uma resposta de API é um erro
 */
export function isErrorResponse(
  response: unknown
): response is ErrorResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    'success' in response &&
    response.success === false &&
    'error' in response
  );
}

/**
 * Helper para criar erros de validação de campo único
 */
export function createFieldError(field: string, message: string): ValidationError {
  return new ValidationError('Erro de validação', {
    fields: [{ field, message }],
  });
}

/**
 * Mensagens de erro user-friendly para códigos comuns
 */
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.VALIDATION_ERROR]: 'Os dados fornecidos são inválidos',
  [ErrorCode.INVALID_INPUT]: 'Entrada inválida',
  [ErrorCode.MISSING_FIELD]: 'Campo obrigatório não preenchido',
  [ErrorCode.INVALID_FORMAT]: 'Formato inválido',
  [ErrorCode.UNAUTHORIZED]: 'Você precisa fazer login para acessar este recurso',
  [ErrorCode.INVALID_CREDENTIALS]: 'Email ou senha incorretos',
  [ErrorCode.SESSION_EXPIRED]: 'Sua sessão expirou. Por favor, faça login novamente',
  [ErrorCode.TOKEN_INVALID]: 'Token de autenticação inválido',
  [ErrorCode.FORBIDDEN]: 'Você não tem permissão para acessar este recurso',
  [ErrorCode.INSUFFICIENT_PERMISSIONS]: 'Permissões insuficientes para realizar esta ação',
  [ErrorCode.NOT_FOUND]: 'Recurso não encontrado',
  [ErrorCode.RESOURCE_NOT_FOUND]: 'O recurso solicitado não foi encontrado',
  [ErrorCode.CONFLICT]: 'Conflito de dados',
  [ErrorCode.DUPLICATE_ENTRY]: 'Este registro já existe',
  [ErrorCode.RESOURCE_ALREADY_EXISTS]: 'Recurso já existe',
  [ErrorCode.DATABASE_ERROR]: 'Erro no banco de dados. Tente novamente mais tarde',
  [ErrorCode.CONNECTION_ERROR]: 'Erro de conexão. Verifique sua internet',
  [ErrorCode.QUERY_ERROR]: 'Erro ao executar consulta no banco de dados',
  [ErrorCode.EXTERNAL_SERVICE_ERROR]: 'Erro ao comunicar com serviço externo',
  [ErrorCode.SERVICE_UNAVAILABLE]: 'Serviço temporariamente indisponível',
  [ErrorCode.INTERNAL_ERROR]: 'Erro interno do servidor',
  [ErrorCode.UNKNOWN_ERROR]: 'Erro desconhecido',
};

/**
 * Obtém mensagem user-friendly a partir do código de erro
 */
export function getUserFriendlyMessage(code: ErrorCode): string {
  return ERROR_MESSAGES[code] || ERROR_MESSAGES[ErrorCode.UNKNOWN_ERROR];
}
