'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password
    });

    if (res?.ok) {
      router.push('/dashboard');
    } else {
      setError('Credenciais inválidas');
    }
  };

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">Login</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          className="w-full p-2 border"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          className="w-full p-2 border"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Senha"
          required
        />
        {error && <p className="text-red-500">{error}</p>}
        <button className="w-full bg-blue-600 text-white p-2 rounded" type="submit">
          Entrar
        </button>
      </form>
    </main>
  );
}
