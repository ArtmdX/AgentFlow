import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { authOptions } from '@/lib/auth';
import { hasPermission, Permission, type SessionWithRole } from '@/lib/permissions';
import prisma from '@/lib/prisma';
import { UserTable } from '@/components/users/UserTable';
import { Loading } from '@/components/ui/Loading';

async function getUsers() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true
    }
  });

  return users;
}

export default async function UsersPage() {
  const session = await getServerSession(authOptions) as SessionWithRole | null;

  if (!session || !session.user) {
    redirect('/auth/login');
  }

  // Verificar permissão para gerenciar usuários
  if (!hasPermission(session, Permission.VIEW_USERS)) {
    redirect('/dashboard');
  }

  const users = await getUsers();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Usuários</h1>
          <p className="mt-1 text-sm text-gray-600">
            Gerencie os usuários do sistema
          </p>
        </div>
        <Link
          href="/dashboard/users/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          Novo Usuário
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">Total de Usuários</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{users.length}</dd>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">Administradores</dt>
                <dd className="mt-1 text-3xl font-semibold text-purple-600">
                  {users.filter(u => u.role === 'admin').length}
                </dd>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">Gerentes</dt>
                <dd className="mt-1 text-3xl font-semibold text-blue-600">
                  {users.filter(u => u.role === 'manager').length}
                </dd>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">Agentes</dt>
                <dd className="mt-1 text-3xl font-semibold text-green-600">
                  {users.filter(u => u.role === 'agent').length}
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <Suspense fallback={<Loading />}>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <UserTable initialUsers={users as any} />
      </Suspense>
    </div>
  );
}
