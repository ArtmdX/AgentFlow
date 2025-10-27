'use client';

/**
 * Error Boundary Component
 *
 * Captura erros em componentes React e exibe UI de fallback
 * Previne que a aplicação inteira quebre por causa de um erro isolado
 */

import React, { Component, ReactNode } from 'react';
import { AppError } from '@/lib/errors';
import { normalizeError } from '@/lib/error-handler';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: AppError, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: AppError | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    const normalizedError = normalizeError(error);
    return {
      hasError: true,
      error: normalizedError,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const normalizedError = normalizeError(error);

    // Log do erro
    console.error('❌ [Error Boundary]', {
      error: normalizedError.toJSON(),
      componentStack: errorInfo.componentStack,
    });

    // Callback customizado (ex: enviar para serviço de logging)
    if (this.props.onError) {
      this.props.onError(normalizedError, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Renderizar fallback customizado se fornecido
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Renderizar UI padrão de erro
      return (
        <ErrorFallback
          error={this.state.error}
          onReset={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Componente de fallback padrão quando ocorre erro
 */
interface ErrorFallbackProps {
  error: AppError;
  onReset: () => void;
}

function ErrorFallback({ error, onReset }: ErrorFallbackProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg border border-red-200 p-6">
        {/* Ícone de erro */}
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
          <svg
            className="w-6 h-6 text-red-600"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>

        {/* Título */}
        <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
          Algo deu errado
        </h2>

        {/* Mensagem de erro */}
        <p className="text-gray-600 text-center mb-4">
          {error.message}
        </p>

        {/* Detalhes técnicos (apenas em desenvolvimento) */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mb-4 text-sm">
            <summary className="cursor-pointer text-gray-500 hover:text-gray-700 mb-2">
              Detalhes técnicos
            </summary>
            <div className="bg-gray-50 p-3 rounded border border-gray-200 overflow-auto">
              <p className="font-mono text-xs mb-1">
                <strong>Código:</strong> {error.code}
              </p>
              <p className="font-mono text-xs mb-1">
                <strong>Status:</strong> {error.statusCode}
              </p>
              {error.details ? (
                <p className="font-mono text-xs">
                  <strong>Detalhes:</strong>{' '}
                  {typeof error.details === 'string'
                    ? error.details
                    : JSON.stringify(error.details, null, 2)}
                </p>
              ) : null}
            </div>
          </details>
        )}

        {/* Ações */}
        <div className="flex gap-2">
          <button
            onClick={onReset}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Tentar novamente
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Recarregar página
          </button>
        </div>

        {/* Link para suporte (se não for erro operacional) */}
        {!error.isOperational && (
          <p className="text-xs text-gray-500 text-center mt-4">
            Se o problema persistir, entre em contato com o suporte.
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Hook para usar Error Boundary de forma mais simples
 */
export function useErrorBoundary() {
  const [error, setError] = React.useState<Error | null>(null);

  if (error) {
    throw error;
  }

  return {
    showBoundary: (err: Error) => setError(err),
    resetBoundary: () => setError(null),
  };
}
