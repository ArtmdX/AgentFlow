'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CustomerForm } from '@/components/forms/CustomerForm';
import { updateCustomer } from '@/services/customerClientService';
import { Customer } from '@prisma/client';
import { CustomerFormData } from '@/types/database';

interface CustomerEditFormProps {
  customer: CustomerFormData;
}

export function CustomerEditForm({ customer }: CustomerEditFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleFormSubmit(data: Customer) {
    setLoading(true);
    setError(null);

    try {
      await updateCustomer(customer.id!, data);

      router.push(`/dashboard/customers/${customer.id}`);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">{error}</div>
      )}
      <CustomerForm
        onSubmit={handleFormSubmit}
        isLoading={loading}
        initialData={customer}
        onCancel={() => router.back()}
        submitButtonText="Atualizar Cliente"
      />
    </>
  );
}
