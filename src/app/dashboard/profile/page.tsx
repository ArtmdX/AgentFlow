'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User as UserIcon, Lock, Save } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { ApiErrorDisplay } from '@/components/error/ApiErrorDisplay';
import { Loading } from '@/components/ui/Loading';
import { getProfile, updateProfile, changePassword } from '@/services/userClientService';
import { updateProfileSchema, changePasswordSchema, type UpdateProfileInput, type ChangePasswordInput } from '@/lib/validations/user';
import type { User } from '@/services/userClientService';

type Tab = 'personal' | 'security';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>('personal');
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form para dados pessoais
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: errorsProfile },
    reset: resetProfile
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema)
  });

  // Form para alteração de senha
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: errorsPassword },
    reset: resetPassword
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema)
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const profileData = await getProfile();
        if (profileData) {
          setUser(profileData);
          resetProfile({
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            phone: profileData.phone || undefined
          });
        }
      } catch (err) {
        console.error('Erro ao carregar perfil:', err);
        setError('Ocorreu um erro ao carregar seus dados');
      } finally {
        setIsLoadingUser(false);
      }
    }

    loadProfile();
  }, [resetProfile]);

  const onSubmitProfile = async (data: UpdateProfileInput) => {
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await updateProfile(data);

      if (result) {
        setUser(result);
        setSuccessMessage('Perfil atualizado com sucesso!');
        setTimeout(() => setSuccessMessage(null), 5000);
      } else {
        setError('Ocorreu um erro ao atualizar seu perfil');
      }
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      setError(err instanceof Error ? err.message : 'Ocorreu um erro inesperado');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitPassword = async (data: ChangePasswordInput) => {
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await changePassword(data);

      if (result) {
        setSuccessMessage('Senha alterada com sucesso!');
        resetPassword();
        setTimeout(() => setSuccessMessage(null), 5000);
      } else {
        setError('Ocorreu um erro ao alterar sua senha');
      }
    } catch (err) {
      console.error('Erro ao alterar senha:', err);
      setError(err instanceof Error ? err.message : 'Ocorreu um erro inesperado');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingUser) {
    return <Loading />;
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Erro ao carregar perfil</h2>
        <p className="mt-2 text-gray-600">Não foi possível carregar seus dados.</p>
      </div>
    );
  }

  const getRoleBadge = (role: string) => {
    const badges = {
      admin: 'bg-purple-100 text-purple-800',
      manager: 'bg-blue-100 text-blue-800',
      agent: 'bg-green-100 text-green-800'
    };

    const labels = {
      admin: 'Administrador',
      manager: 'Gerente',
      agent: 'Agente'
    };

    return (
      <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${badges[role as keyof typeof badges]}`}>
        {labels[role as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Meu Perfil</h1>
        <p className="mt-1 text-sm text-gray-600">
          Gerencie suas informações pessoais e configurações de segurança
        </p>
      </div>

      {/* User Info Card */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-2xl font-semibold text-blue-600">
              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
            </span>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
          <div>
            {getRoleBadge(user.role)}
          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('personal')}
            className={`${
              activeTab === 'personal'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
          >
            <UserIcon className="h-5 w-5" />
            Dados Pessoais
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`${
              activeTab === 'security'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
          >
            <Lock className="h-5 w-5" />
            Segurança
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'personal' && (
        <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-6">
          {error && <ApiErrorDisplay error={error} onDismiss={() => setError(null)} />}

          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
                Informações Pessoais
              </h3>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <Input
                    label="Nome *"
                    {...registerProfile('firstName')}
                    error={errorsProfile.firstName?.message}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="sm:col-span-3">
                  <Input
                    label="Sobrenome *"
                    {...registerProfile('lastName')}
                    error={errorsProfile.lastName?.message}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="sm:col-span-3">
                  <Input
                    label="Telefone"
                    type="tel"
                    {...registerProfile('phone')}
                    error={errorsProfile.phone?.message}
                    disabled={isSubmitting}
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div className="sm:col-span-3">
                  <Input
                    label="Email"
                    type="email"
                    value={user.email}
                    disabled
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    O email não pode ser alterado
                  </p>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        </form>
      )}

      {activeTab === 'security' && (
        <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-6">
          {error && <ApiErrorDisplay error={error} onDismiss={() => setError(null)} />}

          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
                Alterar Senha
              </h3>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <Input
                    label="Senha Atual *"
                    type="password"
                    {...registerPassword('currentPassword')}
                    error={errorsPassword.currentPassword?.message}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="sm:col-span-3">
                  <Input
                    label="Nova Senha *"
                    type="password"
                    {...registerPassword('newPassword')}
                    error={errorsPassword.newPassword?.message}
                    disabled={isSubmitting}
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>

                <div className="sm:col-span-3">
                  <Input
                    label="Confirmar Nova Senha *"
                    type="password"
                    {...registerPassword('confirmPassword')}
                    error={errorsPassword.confirmPassword?.message}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="sm:col-span-6">
                  <div className="rounded-md bg-blue-50 p-4">
                    <div className="flex">
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">Dicas de Segurança</h3>
                        <div className="mt-2 text-sm text-blue-700">
                          <ul className="list-disc list-inside space-y-1">
                            <li>Use no mínimo 6 caracteres</li>
                            <li>Combine letras, números e símbolos</li>
                            <li>Não use informações pessoais óbvias</li>
                            <li>Atualize sua senha regularmente</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Lock className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Alterando...' : 'Alterar Senha'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
