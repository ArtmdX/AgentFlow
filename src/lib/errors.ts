/**
 * Custom Error Classes for AgentFlow CRM
 *
 * Hierarchia de erros:
 * - AppError (base)
 *   - ValidationError (erros de validação de dados)
 *   - AuthorizationError (erros de permissão)
 *   - AuthenticationError (erros de autenticação)
 *   - NotFoundError (recurso não encontrado)
 *   - ConflictError (conflito de dados, ex: duplicata)
 *   - DatabaseError (erros de banco de dados)
 *   - ExternalServiceError (erros de serviços externos)
 */

export enum ErrorCode {
  // Validation Errors (400)
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_FIELD = 'MISSING_FIELD',
  INVALID_FORMAT = 'INVALID_FORMAT',

  // Authentication Errors (401)
  UNAUTHORIZED = 'UNAUTHORIZED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',

  // Authorization Errors (403)
  FORBIDDEN = 'FORBIDDEN',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',

  // Not Found Errors (404)
  NOT_FOUND = 'NOT_FOUND',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',

  // Conflict Errors (409)
  CONFLICT = 'CONFLICT',
  DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',
  RESOURCE_ALREADY_EXISTS = 'RESOURCE_ALREADY_EXISTS',

  // Database Errors (500)
  DATABASE_ERROR = 'DATABASE_ERROR',
  CONNECTION_ERROR = 'CONNECTION_ERROR',
  QUERY_ERROR = 'QUERY_ERROR',

  // External Service Errors (502/503)
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',

  // Internal Errors (500)
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Base class for all application errors
 */
export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly timestamp: Date;
  public readonly details?: unknown;

  constructor(
    message: string,
    code: ErrorCode = ErrorCode.INTERNAL_ERROR,
    statusCode: number = 500,
    isOperational: boolean = true,
    details?: unknown
  ) {
    super(message);

    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date();
    this.details = details;

    // Mantém o stack trace correto
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    const json: {
      name: string;
      message: string;
      code: ErrorCode;
      statusCode: number;
      timestamp: Date;
      details?: unknown;
    } = {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      timestamp: this.timestamp,
    };

    if (this.details !== undefined) {
      json.details = this.details;
    }

    return json;
  }
}

/**
 * Validation Error - Para erros de validação de dados (400)
 */
export class ValidationError extends AppError {
  constructor(
    message: string = 'Dados inválidos',
    details?: unknown,
    code: ErrorCode = ErrorCode.VALIDATION_ERROR
  ) {
    super(message, code, 400, true, details);
  }

  static fromZodError(zodError: { errors?: Array<{ path: (string | number)[]; message: string }> }) {
    const fieldErrors = zodError.errors?.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    return new ValidationError(
      'Erro de validação nos campos do formulário',
      { fields: fieldErrors },
      ErrorCode.VALIDATION_ERROR
    );
  }
}

/**
 * Authentication Error - Para erros de autenticação (401)
 */
export class AuthenticationError extends AppError {
  constructor(
    message: string = 'Não autenticado',
    code: ErrorCode = ErrorCode.UNAUTHORIZED
  ) {
    super(message, code, 401, true);
  }
}

/**
 * Authorization Error - Para erros de autorização/permissão (403)
 */
export class AuthorizationError extends AppError {
  constructor(
    message: string = 'Sem permissão para acessar este recurso',
    requiredPermission?: string
  ) {
    super(
      message,
      ErrorCode.FORBIDDEN,
      403,
      true,
      requiredPermission ? { requiredPermission } : undefined
    );
  }
}

/**
 * Not Found Error - Para recursos não encontrados (404)
 */
export class NotFoundError extends AppError {
  constructor(
    message: string = 'Recurso não encontrado',
    resourceType?: string,
    resourceId?: string | number
  ) {
    super(
      message,
      ErrorCode.NOT_FOUND,
      404,
      true,
      resourceType ? { resourceType, resourceId } : undefined
    );
  }
}

/**
 * Conflict Error - Para conflitos de dados (409)
 */
export class ConflictError extends AppError {
  constructor(
    message: string = 'Conflito de dados',
    details?: unknown,
    code: ErrorCode = ErrorCode.CONFLICT
  ) {
    super(message, code, 409, true, details);
  }
}

/**
 * Database Error - Para erros de banco de dados (500)
 */
export class DatabaseError extends AppError {
  constructor(
    message: string = 'Erro no banco de dados',
    originalError?: Error
  ) {
    super(
      message,
      ErrorCode.DATABASE_ERROR,
      500,
      false, // Não operacional - erro de infraestrutura
      originalError ? { originalError: originalError.message } : undefined
    );
  }
}

/**
 * External Service Error - Para erros de serviços externos (502/503)
 */
export class ExternalServiceError extends AppError {
  constructor(
    message: string = 'Erro ao comunicar com serviço externo',
    serviceName?: string,
    statusCode: number = 502
  ) {
    super(
      message,
      ErrorCode.EXTERNAL_SERVICE_ERROR,
      statusCode,
      true,
      serviceName ? { serviceName } : undefined
    );
  }
}

/**
 * Type guard para verificar se é um AppError
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * Type guard para verificar se é um erro operacional
 */
export function isOperationalError(error: unknown): boolean {
  if (isAppError(error)) {
    return error.isOperational;
  }
  return false;
}
