'use client';

/**
 * Empty State Component
 *
 * Componente para exibir quando não há dados para mostrar
 */

import React from 'react';

interface EmptyStateProps {
  title?: string;
  message: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  title = 'Nenhum dado encontrado',
  message,
  icon,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      {/* Ícone */}
      {icon ? (
        <div className="mb-4">{icon}</div>
      ) : (
        <svg
          className="w-16 h-16 text-gray-300 mb-4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
        </svg>
      )}

      {/* Título */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>

      {/* Mensagem */}
      <p className="text-gray-600 text-center max-w-md mb-6">{message}</p>

      {/* Ação */}
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

/**
 * Variações de EmptyState para casos específicos
 */

export function EmptyCustomers({ onCreateClick }: { onCreateClick?: () => void }) {
  return (
    <EmptyState
      title="Nenhum cliente cadastrado"
      message="Comece adicionando seu primeiro cliente para gerenciar viagens e pagamentos."
      action={
        onCreateClick
          ? {
              label: 'Adicionar Cliente',
              onClick: onCreateClick,
            }
          : undefined
      }
    />
  );
}

export function EmptyTravels({ onCreateClick }: { onCreateClick?: () => void }) {
  return (
    <EmptyState
      title="Nenhuma viagem encontrada"
      message="Crie uma nova viagem para começar a gerenciar destinos, passageiros e pagamentos."
      action={
        onCreateClick
          ? {
              label: 'Nova Viagem',
              onClick: onCreateClick,
            }
          : undefined
      }
    />
  );
}

export function EmptyPayments() {
  return (
    <EmptyState
      title="Nenhum pagamento registrado"
      message="Os pagamentos relacionados a esta viagem aparecerão aqui."
    />
  );
}

export function EmptySearchResults({ searchTerm }: { searchTerm: string }) {
  return (
    <EmptyState
      title="Nenhum resultado encontrado"
      message={`Não encontramos resultados para "${searchTerm}". Tente ajustar os filtros ou termos de busca.`}
      icon={
        <svg
          className="w-16 h-16 text-gray-300"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      }
    />
  );
}
