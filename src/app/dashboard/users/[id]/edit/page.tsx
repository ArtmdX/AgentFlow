'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { UserForm } from '@/components/users/UserForm';
import { getUser, updateUser } from '@/services/userClientService';
import { Loading } from '@/components/ui/Loading';
import { ErrorResponse } from '@/lib/error-handler';
import type { UpdateUserInput } from '@/lib/validations/user';
import type { User } from '@/services/userClientService';

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ErrorResponse | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const userData = await getUser(userId);
        if (userData) {
          setUser(userData);
        } else {
          setError({
            error: 'Usuário não encontrado',
            message: 'O usuário solicitado não foi encontrado'
          });
        }
      } catch (err) {
        console.error('Erro ao carregar usuário:', err);
        setError({
          error: 'Erro ao carregar usuário',
          message: 'Ocorreu um erro ao carregar os dados do usuário'
        });
      } finally {
        setIsLoadingUser(false);
      }
    }

    loadUser();
  }, [userId]);

  const handleSubmit = async (data: UpdateUserInput) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await updateUser(userId, data);

      if (result) {
        alert('Usuário atualizado com sucesso!');
        router.push(`/dashboard/users/${userId}`);
      } else {
        setError({
          error: 'Erro ao atualizar usuário',
          message: 'Ocorreu um erro ao atualizar o usuário. Tente novamente.'
        });
      }
    } catch (err) {
      console.error('Erro ao atualizar usuário:', err);
      setError({
        error: 'Erro ao atualizar usuário',
        message: err instanceof Error ? err.message : 'Ocorreu um erro inesperado'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/dashboard/users/${userId}`);
  };

  const handleClearError = () => {
    setError(null);
  };

  if (isLoadingUser) {
    return <Loading />;
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Usuário não encontrado</h2>
        <p className="mt-2 text-gray-600">O usuário solicitado não existe.</p>
        <Link
          href="/dashboard/users"
          className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para usuários
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/dashboard/users/${userId}`}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Editar Usuário</h1>
          <p className="mt-1 text-sm text-gray-600">
            Atualize as informações de {user.firstName} {user.lastName}
          </p>
        </div>
      </div>

      {/* Form */}
      <UserForm
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        initialData={user}
        submitButtonText="Salvar Alterações"
        onCancel={handleCancel}
        error={error}
        onClearError={handleClearError}
        mode="edit"
      />
    </div>
  );
}
