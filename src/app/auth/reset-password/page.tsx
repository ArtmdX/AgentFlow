'use client';

import { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { resetPasswordSchema, type ResetPasswordInput } from '@/lib/validations/user';
import { resetPassword } from '@/services/userClientService';
import { Loading } from '@/components/ui/Loading';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token || ''
    }
  });

  useEffect(() => {
    if (!token) {
      setError('Token de recuperação não encontrado. Solicite uma nova recuperação de senha.');
    }
  }, [token]);

  const onSubmit = async (data: ResetPasswordInput) => {
    if (!token) {
      setError('Token de recuperação não encontrado.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      const result = await resetPassword(data);

      if (result) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      } else {
        setError('Ocorreu um erro ao redefinir sua senha. Tente novamente.');
      }
    } catch (err) {
      console.error('Erro ao redefinir senha:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro inesperado';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Senha Redefinida!</h2>
            <p className="mt-4 text-sm text-gray-600">
              Sua senha foi alterada com sucesso.
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Você será redirecionado para a página de login em alguns segundos...
            </p>
          </div>

          <div className="mt-6">
            <Link
              href="/auth/login"
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Ir para Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <AlertCircle className="mx-auto h-16 w-16 text-red-500" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Link Inválido</h2>
            <p className="mt-4 text-sm text-gray-600">
              {error || 'O link de recuperação de senha é inválido ou expirou.'}
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href="/auth/forgot-password"
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Solicitar Novo Link
            </Link>
            <Link
              href="/auth/login"
              className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Voltar para Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">Redefinir Senha</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Digite sua nova senha abaixo
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" {...register('token')} value={token} />

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Nova Senha
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type="password"
                {...register('password')}
                className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Mínimo 6 caracteres"
                disabled={isSubmitting}
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirmar Nova Senha
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword')}
                className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Digite a senha novamente"
                disabled={isSubmitting}
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="rounded-md bg-blue-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Dicas de Segurança</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Use no mínimo 6 caracteres</li>
                    <li>Combine letras, números e símbolos</li>
                    <li>Não use informações pessoais óbvias</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Redefinindo...' : 'Redefinir Senha'}
            </button>
          </div>

          <div className="text-center">
            <Link href="/auth/login" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Voltar para login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
