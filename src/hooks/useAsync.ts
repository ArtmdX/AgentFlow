'use client';

/**
 * useAsync Hook
 *
 * Hook para gerenciar operações assíncronas com estados de loading, error e data
 */

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseAsyncOptions<T> {
  immediate?: boolean; // Se true, executa automaticamente ao montar
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  initialData?: T;
}

interface UseAsyncReturn<T, Args extends unknown[]> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  isIdle: boolean;
  isSuccess: boolean;
  isError: boolean;
  execute: (...args: Args) => Promise<T | null>;
  reset: () => void;
  setData: (data: T | null) => void;
}

/**
 * Hook useAsync
 *
 * @example
 * ```tsx
 * const { data, isLoading, error, execute } = useAsync(fetchCustomers);
 *
 * // Executar manualmente
 * const handleClick = async () => {
 *   await execute();
 * };
 *
 * // Executar automaticamente
 * const { data } = useAsync(fetchCustomers, { immediate: true });
 * ```
 */
export function useAsync<T, Args extends unknown[] = []>(
  asyncFunction: (...args: Args) => Promise<T>,
  options: UseAsyncOptions<T> = {}
): UseAsyncReturn<T, Args> {
  const {
    immediate = false,
    onSuccess,
    onError,
    initialData = null,
  } = options;

  const [state, setState] = useState<{
    data: T | null;
    error: Error | null;
    isLoading: boolean;
  }>({
    data: initialData,
    error: null,
    isLoading: immediate,
  });

  const mountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      abortControllerRef.current?.abort();
    };
  }, []);

  const execute = useCallback(
    async (...args: Args): Promise<T | null> => {
      // Abortar requisição anterior
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
      }));

      try {
        const response = await asyncFunction(...args);

        if (mountedRef.current) {
          setState({
            data: response,
            error: null,
            isLoading: false,
          });

          onSuccess?.(response);
          return response;
        }

        return null;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));

        if (mountedRef.current) {
          setState({
            data: null,
            error: err,
            isLoading: false,
          });

          onError?.(err);
        }

        return null;
      }
    },
    [asyncFunction, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setState({
      data: initialData,
      error: null,
      isLoading: false,
    });
  }, [initialData]);

  const setData = useCallback((data: T | null) => {
    setState((prev) => ({
      ...prev,
      data,
    }));
  }, []);

  // Executar imediatamente se immediate = true
  useEffect(() => {
    if (immediate) {
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    data: state.data,
    error: state.error,
    isLoading: state.isLoading,
    isIdle: !state.isLoading && !state.error && !state.data,
    isSuccess: !state.isLoading && !state.error && state.data !== null,
    isError: !state.isLoading && state.error !== null,
    execute,
    reset,
    setData,
  };
}

/**
 * Hook useAsyncCallback
 *
 * Variação do useAsync para callbacks (não executa imediatamente)
 */
export function useAsyncCallback<T, Args extends unknown[] = []>(
  asyncFunction: (...args: Args) => Promise<T>,
  options?: Omit<UseAsyncOptions<T>, 'immediate'>
): UseAsyncReturn<T, Args> {
  return useAsync(asyncFunction, { ...options, immediate: false });
}
