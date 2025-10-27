'use client';

/**
 * API Error Display Component
 *
 * Componente para exibir erros de API de forma user-friendly
 * Pode ser usado em formulários, páginas, modals, etc.
 */

import React from 'react';
import { ErrorResponse, isErrorResponse } from '@/lib/error-handler';
import { ErrorCode } from '@/lib/errors';

interface ApiErrorDisplayProps {
  error: ErrorResponse | Error | string | null | undefined;
  className?: string;
  variant?: 'inline' | 'banner' | 'toast';
  onRetry?: () => void;
  onDismiss?: () => void;
}

export function ApiErrorDisplay({
  error,
  className = '',
  variant = 'banner',
  onRetry,
  onDismiss,
}: ApiErrorDisplayProps) {
  // Extrair mensagem e detalhes do erro
  const errorInfo = React.useMemo(() => {
    if (!error) {
      return { message: '', code: null, details: null };
    }

    if (typeof error === 'string') {
      return { message: error, code: null, details: null };
    }

    if (error instanceof Error) {
      return { message: error.message, code: null, details: null };
    }

    if (isErrorResponse(error)) {
      return {
        message: error.error.message,
        code: error.error.code,
        details: error.error.details,
      };
    }

    return { message: 'Erro desconhecido', code: null, details: null };
  }, [error]);

  if (!error) return null;

  // Determinar ícone baseado no código de erro
  const getIcon = () => {
    if (!errorInfo.code) return '⚠️';

    switch (errorInfo.code) {
      case ErrorCode.VALIDATION_ERROR:
      case ErrorCode.INVALID_INPUT:
        return '📝';
      case ErrorCode.UNAUTHORIZED:
      case ErrorCode.FORBIDDEN:
        return '🔒';
      case ErrorCode.NOT_FOUND:
        return '🔍';
      case ErrorCode.CONFLICT:
      case ErrorCode.DUPLICATE_ENTRY:
        return '⚡';
      case ErrorCode.DATABASE_ERROR:
      case ErrorCode.INTERNAL_ERROR:
        return '💥';
      default:
        return '⚠️';
    }
  };

  // Determinar cor baseada no tipo de erro
  const getColorClasses = () => {
    if (!errorInfo.code) return 'bg-red-50 border-red-200 text-red-800';

    if (
      [ErrorCode.VALIDATION_ERROR, ErrorCode.INVALID_INPUT].includes(errorInfo.code)
    ) {
      return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    }

    if ([ErrorCode.NOT_FOUND].includes(errorInfo.code)) {
      return 'bg-blue-50 border-blue-200 text-blue-800';
    }

    return 'bg-red-50 border-red-200 text-red-800';
  };

  // Renderizar erros de validação de campo
  const renderFieldErrors = () => {
    if (!errorInfo.details || typeof errorInfo.details !== 'object') return null;

    const details = errorInfo.details as { fields?: Array<{ field: string; message: string }> };
    if (!details.fields || !Array.isArray(details.fields)) return null;

    return (
      <ul className="mt-2 space-y-1 text-sm">
        {details.fields.map((fieldError, index: number) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-red-600">•</span>
            <span>
              <strong>{fieldError.field}:</strong> {fieldError.message}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  // Variantes de renderização
  if (variant === 'inline') {
    return (
      <div className={`text-sm text-red-600 ${className}`}>
        {errorInfo.message}
      </div>
    );
  }

  if (variant === 'toast') {
    return (
      <div
        className={`fixed top-4 right-4 max-w-md bg-white rounded-lg shadow-lg border border-red-200 p-4 z-50 ${className}`}
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl">{getIcon()}</span>
          <div className="flex-1">
            <p className="font-medium text-gray-900">{errorInfo.message}</p>
            {renderFieldErrors()}
          </div>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Fechar"
            >
              ✕
            </button>
          )}
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-3 w-full px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
          >
            Tentar novamente
          </button>
        )}
      </div>
    );
  }

  // Banner (padrão)
  return (
    <div
      className={`rounded-lg border p-4 ${getColorClasses()} ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0">{getIcon()}</span>
        <div className="flex-1">
          <p className="font-medium">{errorInfo.message}</p>
          {renderFieldErrors()}

          {/* Detalhes técnicos em desenvolvimento */}
          {process.env.NODE_ENV === 'development' && errorInfo.code && (
            <p className="text-xs mt-2 opacity-70">
              Código: {errorInfo.code}
            </p>
          )}
        </div>
        <div className="flex gap-2 flex-shrink-0">
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-sm underline hover:no-underline"
            >
              Tentar novamente
            </button>
          )}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Fechar"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Hook para gerenciar estado de erro de API
 */
export function useApiError() {
  const [error, setError] = React.useState<ErrorResponse | null>(null);

  const showError = React.useCallback((err: ErrorResponse | Error | string) => {
    if (typeof err === 'string') {
      setError({
        success: false,
        error: {
          message: err,
          code: ErrorCode.UNKNOWN_ERROR,
          statusCode: 500,
          timestamp: new Date().toISOString(),
        },
      });
    } else if (err instanceof Error) {
      setError({
        success: false,
        error: {
          message: err.message,
          code: ErrorCode.INTERNAL_ERROR,
          statusCode: 500,
          timestamp: new Date().toISOString(),
        },
      });
    } else {
      setError(err);
    }
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    showError,
    clearError,
    hasError: error !== null,
  };
}
