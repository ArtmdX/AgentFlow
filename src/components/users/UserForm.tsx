'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ApiErrorDisplay } from '@/components/error/ApiErrorDisplay';
import { ErrorResponse } from '@/lib/error-handler';
import { createUserSchema, updateUserSchema, type CreateUserInput, type UpdateUserInput } from '@/lib/validations/user';
import type { User } from '@/services/userClientService';

interface UserFormProps {
  onSubmit: (data: CreateUserInput | UpdateUserInput) => void | Promise<void>;
  isLoading: boolean;
  initialData?: Partial<User>;
  submitButtonText?: string;
  onCancel: () => void;
  error?: ErrorResponse | Error | string | null;
  onClearError?: () => void;
  mode?: 'create' | 'edit';
}

export function UserForm({
  onSubmit,
  isLoading,
  initialData,
  submitButtonText = 'Salvar',
  onCancel,
  error,
  onClearError,
  mode = 'create'
}: UserFormProps) {
  const schema = mode === 'create' ? createUserSchema : updateUserSchema;

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateUserInput | UpdateUserInput>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      role: 'agent',
      isActive: true
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Exibir erro de API se houver */}
      {error && (
        <ApiErrorDisplay
          error={error}
          onDismiss={onClearError}
        />
      )}

      {/* Seção de Dados Pessoais */}
      <div className="p-6 bg-white rounded-lg shadow">
        <h3 className="text-lg font-medium leading-6 text-gray-900 border-b pb-4">
          Dados Pessoais
        </h3>
        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <Input
              label="Nome *"
              {...register('firstName')}
              error={errors.firstName?.message}
              disabled={isLoading}
            />
          </div>

          <div className="sm:col-span-3">
            <Input
              label="Sobrenome *"
              {...register('lastName')}
              error={errors.lastName?.message}
              disabled={isLoading}
            />
          </div>

          <div className="sm:col-span-4">
            <Input
              label="E-mail *"
              type="email"
              {...register('email')}
              error={errors.email?.message}
              disabled={isLoading || mode === 'edit'}
              placeholder="usuario@agentflow.com"
            />
            {mode === 'edit' && (
              <p className="mt-1 text-sm text-gray-500">
                O email não pode ser alterado
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <Input
              label="Telefone"
              type="tel"
              {...register('phone')}
              error={errors.phone?.message}
              disabled={isLoading}
              placeholder="(11) 99999-9999"
            />
          </div>
        </div>
      </div>

      {/* Seção de Credenciais (apenas no modo create) */}
      {mode === 'create' && (
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium leading-6 text-gray-900 border-b pb-4">
            Credenciais
          </h3>
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <Input
                label="Senha *"
                type="password"
                {...register('password' as keyof CreateUserInput)}
                error={('password' in errors) ? errors.password?.message : undefined}
                disabled={isLoading}
                placeholder="Mínimo 6 caracteres"
              />
              <p className="mt-1 text-sm text-gray-500">
                A senha deve ter no mínimo 6 caracteres
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Seção de Permissões */}
      <div className="p-6 bg-white rounded-lg shadow">
        <h3 className="text-lg font-medium leading-6 text-gray-900 border-b pb-4">
          Permissões e Status
        </h3>
        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <Select
              label="Nível de Acesso *"
              {...register('role')}
              error={errors.role?.message}
              disabled={isLoading}
            >
              <option value="agent">Agente</option>
              <option value="manager">Gerente</option>
              <option value="admin">Administrador</option>
            </Select>
            <div className="mt-2 text-sm text-gray-600">
              <p className="font-medium mb-1">Permissões por nível:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li><strong>Agente:</strong> Gerencia apenas seus próprios clientes e viagens</li>
                <li><strong>Gerente:</strong> Visualiza todos os dados, gerencia agentes</li>
                <li><strong>Admin:</strong> Acesso total ao sistema, incluindo configurações</li>
              </ul>
            </div>
          </div>

          <div className="sm:col-span-3">
            <Select
              label="Status *"
              {...register('isActive', {
                setValueAs: (v) => v === 'true' || v === true
              })}
              error={errors.isActive?.message}
              disabled={isLoading}
            >
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
            </Select>
            <p className="mt-2 text-sm text-gray-500">
              Usuários inativos não podem fazer login no sistema
            </p>
          </div>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex items-center justify-end gap-x-4 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Salvando...' : submitButtonText}
        </button>
      </div>
    </form>
  );
}
