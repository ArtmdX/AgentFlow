'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { UserForm } from '@/components/users/UserForm';
import { createUser } from '@/services/userClientService';

import type { CreateUserInput } from '@/lib/validations/user';

export default function NewUserPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: CreateUserInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await createUser(data);

      if (result) {
        alert(`Usuário criado com sucesso!\n\nEmail: ${result.email}\nSenha: (conforme cadastrada)\n\nOriente o usuário a fazer login.`);
        router.push('/dashboard/users');
      } else {
        setError('Ocorreu um erro ao criar o usuário. Tente novamente.');
      }
    } catch (err) {
      console.error('Erro ao criar usuário:', err);
      setError(err instanceof Error ? err.message : 'Ocorreu um erro inesperado');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/users');
  };

  const handleClearError = () => {
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/users"
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Novo Usuário</h1>
          <p className="mt-1 text-sm text-gray-600">
            Preencha os dados para criar um novo usuário
          </p>
        </div>
      </div>

      {/* Form */}
      <UserForm
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onSubmit={handleSubmit as any}
        isLoading={isLoading}
        submitButtonText="Criar Usuário"
        onCancel={handleCancel}
        error={error}
        onClearError={handleClearError}
        mode="create"
      />
    </div>
  );
}
