'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CustomerForm } from '@/components/forms/CustomerForm';
import { Customer } from '@prisma/client';

export default function NewCustomerPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleFormSubmit(data: Customer) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.message || 'Falha ao cadastrar cliente.');
      }

      // Sucesso! Redireciona para a lista de clientes
      router.push('/customers');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Novo Cliente</h2>
        <p className="text-gray-600">Preencha os dados para cadastrar um novo cliente.</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">{error}</div>
      )}

      <CustomerForm
        onSubmit={handleFormSubmit}
        isLoading={loading}
        onCancel={() => router.back()}
        submitButtonText="Salvar Cliente"
      />
    </div>
  );
}
