'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  showLimitSelector?: boolean;
  limitOptions?: number[];
}

export default function Pagination({
  pagination,
  onPageChange,
  onLimitChange,
  showLimitSelector = true,
  limitOptions = [10, 25, 50, 100]
}: PaginationProps) {
  const { page, limit, total, totalPages } = pagination;

  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  const canGoPrevious = page > 1;
  const canGoNext = page < totalPages;

  // Gera array de páginas para mostrar (com ... quando necessário)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Mostra todas as páginas se forem poucas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Sempre mostra primeira página
      pages.push(1);

      if (page > 3) {
        pages.push('...');
      }

      // Páginas ao redor da atual
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (page < totalPages - 2) {
        pages.push('...');
      }

      // Sempre mostra última página
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (total === 0) {
    return (
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="text-sm text-gray-700">
          Nenhum resultado encontrado
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 gap-4">
      {/* Info de resultados */}
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-700">
          Mostrando <span className="font-medium">{startItem}</span> até{' '}
          <span className="font-medium">{endItem}</span> de{' '}
          <span className="font-medium">{total}</span> resultados
        </div>

        {/* Seletor de itens por página */}
        {showLimitSelector && onLimitChange && (
          <div className="flex items-center gap-2">
            <label htmlFor="limit-select" className="text-sm text-gray-700">
              Por página:
            </label>
            <select
              id="limit-select"
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="rounded-md border-gray-300 py-1 pl-2 pr-8 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {limitOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Controles de navegação */}
      <div className="flex items-center gap-2">
        {/* Botão Anterior */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!canGoPrevious}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
          aria-label="Página anterior"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline ml-1">Anterior</span>
        </button>

        {/* Números de página */}
        <div className="hidden sm:flex items-center gap-1">
          {getPageNumbers().map((pageNum, idx) => {
            if (pageNum === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-3 py-2 text-sm text-gray-700"
                >
                  ...
                </span>
              );
            }

            const isActive = pageNum === page;
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum as number)}
                className={`relative inline-flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                  isActive
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
                aria-label={`Página ${pageNum}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Info de página atual (mobile) */}
        <div className="sm:hidden text-sm text-gray-700">
          Página {page} de {totalPages}
        </div>

        {/* Botão Próximo */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!canGoNext}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
          aria-label="Próxima página"
        >
          <span className="hidden sm:inline mr-1">Próxima</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
