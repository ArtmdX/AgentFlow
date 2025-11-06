import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit, Mail, Phone, Calendar, Shield, Activity } from 'lucide-react';
import { authOptions } from '@/lib/auth';
import { hasPermission, Permission, type SessionWithRole } from '@/lib/permissions';
import prisma from '@/lib/prisma';
import { Loading } from '@/components/ui/Loading';

async function getUser(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          travels: true,
          customersCreated: true,
          payments: true
        }
      }
    }
  });

  return user;
}

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function UserDetailPage({ params }: PageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions) as SessionWithRole | null;

  if (!session || !session.user) {
    redirect('/auth/login');
  }

  // Verificar permissão
  const isOwnProfile = session.user.id === id;
  if (!isOwnProfile && !hasPermission(session, Permission.VIEW_USERS)) {
    redirect('/dashboard');
  }

  const user = await getUser(id);

  if (!user) {
    notFound();
  }

  const getRoleBadge = (role: string | null) => {
    const roleKey = role || 'agent';
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
      <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${badges[roleKey as keyof typeof badges]}`}>
        {labels[roleKey as keyof typeof labels]}
      </span>
    );
  };

  const getStatusBadge = (isActive: boolean | null) => {
    const active = isActive !== null ? isActive : false;
    return (
      <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${
        active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {active ? 'Ativo' : 'Inativo'}
      </span>
    );
  };

  return (
    <Suspense fallback={<Loading />}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/users"
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {user.firstName} {user.lastName}
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Detalhes do usuário
              </p>
            </div>
          </div>
          {hasPermission(session, Permission.UPDATE_USER) && (
            <Link
              href={`/dashboard/users/${id}/edit`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Link>
          )}
        </div>

        {/* User Info */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Informações Pessoais
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Dados cadastrais e informações de contato
              </p>
            </div>
            <div className="flex gap-2">
              {getRoleBadge(user.role)}
              {getStatusBadge(user.isActive)}
            </div>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
              </div>

              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Telefone
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{user.phone || 'Não informado'}</dd>
              </div>

              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Nível de Acesso
                </dt>
                <dd className="mt-1 text-sm text-gray-900 capitalize">{user.role}</dd>
              </div>

              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Status
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {user.isActive ? 'Ativo' : 'Inativo'}
                </dd>
              </div>

              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Data de Cadastro
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  }) : 'N/A'}
                </dd>
              </div>

              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Última Atualização
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  }) : 'N/A'}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Estatísticas
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Atividades e registros criados por este usuário
            </p>
          </div>
          <div className="border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-3">
              <div className="px-4 py-5 sm:p-6 border-r border-gray-200">
                <dt className="text-sm font-medium text-gray-500">Viagens</dt>
                <dd className="mt-1 text-3xl font-semibold text-blue-600">
                  {user._count.travels}
                </dd>
              </div>

              <div className="px-4 py-5 sm:p-6 border-r border-gray-200">
                <dt className="text-sm font-medium text-gray-500">Clientes Criados</dt>
                <dd className="mt-1 text-3xl font-semibold text-green-600">
                  {user._count.customersCreated}
                </dd>
              </div>

              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500">Pagamentos Registrados</dt>
                <dd className="mt-1 text-3xl font-semibold text-purple-600">
                  {user._count.payments}
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
