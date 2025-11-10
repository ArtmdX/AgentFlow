'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, ReactNode } from 'react';

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  // Criar QueryClient dentro do componente para evitar problemas com SSR
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Configurações padrão para queries
            staleTime: 60 * 1000, // 1 minuto - dados considerados "fresh"
            gcTime: 5 * 60 * 1000, // 5 minutos - tempo antes de garbage collection (anteriormente cacheTime)
            refetchOnWindowFocus: false, // Não refetch ao focar na janela
            refetchOnMount: true, // Refetch ao montar componente se stale
            refetchOnReconnect: true, // Refetch ao reconectar
            retry: 1, // Tentar novamente uma vez em caso de erro
          },
          mutations: {
            // Configurações padrão para mutations
            retry: false, // Não tentar novamente mutations automaticamente
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools - sempre ativo para demo */}
      <ReactQueryDevtools
        initialIsOpen={false}
        buttonPosition="bottom-right"
        position="bottom"
      />
    </QueryClientProvider>
  );
}
