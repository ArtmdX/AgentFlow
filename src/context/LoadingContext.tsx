'use client';

/**
 * Loading Context
 *
 * Gerencia estado global de loading para operações críticas
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  loadingMessage: string | null;
  startLoading: (message?: string) => void;
  stopLoading: () => void;
  setLoadingMessage: (message: string) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);

  const startLoading = useCallback((message?: string) => {
    setIsLoading(true);
    if (message) {
      setLoadingMessage(message);
    }
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    setLoadingMessage(null);
  }, []);

  const updateLoadingMessage = useCallback((message: string) => {
    setLoadingMessage(message);
  }, []);

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        loadingMessage,
        startLoading,
        stopLoading,
        setLoadingMessage: updateLoadingMessage,
      }}
    >
      {children}

      {/* Global loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full mx-4">
            <div className="flex items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <div>
                <p className="text-gray-900 font-medium">Carregando...</p>
                {loadingMessage && (
                  <p className="text-gray-600 text-sm mt-1">{loadingMessage}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
}

/**
 * Hook para usar o LoadingContext
 */
export function useLoading() {
  const context = useContext(LoadingContext);

  if (context === undefined) {
    throw new Error('useLoading deve ser usado dentro de um LoadingProvider');
  }

  return context;
}
