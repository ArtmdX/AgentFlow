'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteCustomer } from '@/services/customerClientService';
import { Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface CustomerActionsProps {
  customerId: string;
}

export function CustomerActions({ customerId }: CustomerActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    //Alterar para Toastfy
    const confirmed = window.confirm('Tem certeza que deseja deletar este cliente? Esta ação não pode ser desfeita.');

    if (confirmed) {
      setIsDeleting(true);
      try {
        await deleteCustomer(customerId);
        router.push('/dashboard/customers');
        router.refresh();
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        alert(`Erro ao deletar cliente: ${errorMessage}`);
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Link href={`/dashboard/customers/${customerId}/edit`}>
        <button className="flex cursor-pointer items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
          <Pencil className="h-4 w-4" />
          <span>Editar</span>
        </button>
      </Link>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="flex cursor-pointer items-center space-x-2 px-3 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 disabled:opacity-50">
        <Trash2 className="h-4 w-4" />
        <span>{isDeleting ? 'Deletando...' : 'Deletar'}</span>
      </button>
    </div>
  );
}
