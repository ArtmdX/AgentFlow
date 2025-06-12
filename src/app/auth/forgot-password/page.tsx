'use client';
import Link from 'next/link';

export default function ForgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">Recuperar Senha</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Esta funcionalidade estará disponível em breve</p>
        </div>

        <div className="text-center">
          <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Voltar para login
          </Link>
        </div>
      </div>
    </div>
  );
}
