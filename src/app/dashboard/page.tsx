import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <p>Acesso negado. Faça login.</p>;
  }

  return <p>Bem-vindo, {session.user?.email}!</p>;
}
