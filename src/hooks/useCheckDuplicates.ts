import { useState, useEffect, useCallback } from 'react';

interface DuplicateCustomer {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  documentNumber: string | null;
}

interface Duplicate {
  field: string;
  value: string;
  customer: DuplicateCustomer;
}

interface CheckDuplicatesParams {
  email?: string;
  documentNumber?: string;
  excludeId?: string; // Para excluir o próprio cliente ao editar
  debounceMs?: number;
}

interface CheckDuplicatesResult {
  duplicates: Duplicate[];
  isChecking: boolean;
  error: string | null;
}

/**
 * Hook para verificar duplicatas de cliente com debounce
 *
 * @param params - Parâmetros de verificação
 * @returns Estado da verificação de duplicatas
 */
export function useCheckDuplicates({
  email,
  documentNumber,
  excludeId,
  debounceMs = 500,
}: CheckDuplicatesParams): CheckDuplicatesResult {
  const [duplicates, setDuplicates] = useState<Duplicate[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkDuplicates = useCallback(
    async (emailToCheck?: string, docToCheck?: string) => {
      // Se não há dados para verificar, limpa o estado
      if (!emailToCheck && !docToCheck) {
        setDuplicates([]);
        setIsChecking(false);
        return;
      }

      setIsChecking(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (emailToCheck) params.set('email', emailToCheck);
        if (docToCheck) params.set('documentNumber', docToCheck);
        if (excludeId) params.set('excludeId', excludeId);

        const response = await fetch(`/api/check-duplicates?${params.toString()}`);

        if (!response.ok) {
          throw new Error('Erro ao verificar duplicatas');
        }

        const data = await response.json();
        setDuplicates(data.duplicates || []);
      } catch (err) {
        console.error('Erro ao verificar duplicatas:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        setDuplicates([]);
      } finally {
        setIsChecking(false);
      }
    },
    [excludeId]
  );

  // Debounce effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkDuplicates(email, documentNumber);
    }, debounceMs);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [email, documentNumber, debounceMs, checkDuplicates]);

  return {
    duplicates,
    isChecking,
    error,
  };
}
