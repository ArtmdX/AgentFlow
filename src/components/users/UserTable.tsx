'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Edit, Key, PowerOff, Power } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { toggleUserActive, adminResetPassword } from '@/services/userClientService';
import type { User } from '@/services/userClientService';

interface UserTableProps {
  initialUsers: User[];
  onUserUpdate?: () => void;
}

export function UserTable({ initialUsers, onUserUpdate }: UserTableProps) {
  const [users, setUsers] = useState(initialUsers);
  const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false);
  const [showToggleDialog, setShowToggleDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const getRoleBadge = (role: string) => {
    const badges = {
      admin: 'bg-purple-100 text-purple-800',
      manager: 'bg-blue-100 text-blue-800',
      agent: 'bg-green-100 text-green-800'
    };

    const labels = {
      admin: 'Admin',
      manager: 'Gerente',
      agent: 'Agente'
    };

    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${badges[role as keyof typeof badges]}`}>
        {labels[role as keyof typeof labels]}
      </span>
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
        isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {isActive ? 'Ativo' : 'Inativo'}
      </span>
    );
  };

  const handleEditClick = (e: React.MouseEvent, userId: string) => {
    e.stopPropagation();
    router.push(`/dashboard/users/${userId}/edit`);
  };

  const handleResetPasswordClick = (e: React.MouseEvent, user: User) => {
    e.stopPropagation();
    setSelectedUser(user);
    setShowResetPasswordDialog(true);
  };

  const handleToggleActiveClick = (e: React.MouseEvent, user: User) => {
    e.stopPropagation();
    setSelectedUser(user);
    setShowToggleDialog(true);
  };

  const handleConfirmResetPassword = async () => {
    if (!selectedUser) return;

    setIsProcessing(true);
    try {
      // Gerar senha temporária
      const tempPassword = 'senha123'; // Em produção, você pode gerar uma senha aleatória

      const result = await adminResetPassword(selectedUser.id, {
        newPassword: tempPassword,
        confirmPassword: tempPassword
      });

      if (result) {
        alert(`Senha resetada com sucesso!\n\nSenha temporária: ${tempPassword}\n\nOriente o usuário a alterar a senha após o login.`);
        onUserUpdate?.();
      } else {
        alert('Erro ao resetar senha. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao resetar senha:', error);
      alert('Erro ao resetar senha. Tente novamente.');
    } finally {
      setIsProcessing(false);
      setShowResetPasswordDialog(false);
      setSelectedUser(null);
    }
  };

  const handleConfirmToggle = async () => {
    if (!selectedUser) return;

    setIsProcessing(true);
    try {
      const result = await toggleUserActive(selectedUser.id);

      if (result) {
        // Atualizar estado local
        setUsers(users.map(u =>
          u.id === selectedUser.id ? result.user : u
        ));
        alert(result.message);
        onUserUpdate?.();
      } else {
        alert('Erro ao atualizar status do usuário. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status do usuário. Tente novamente.');
    } finally {
      setIsProcessing(false);
      setShowToggleDialog(false);
      setSelectedUser(null);
    }
  };

  return (
    <>
      {users.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-center text-gray-500">Nenhum usuário encontrado.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Telefone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nível
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map(user => (
                  <tr
                    key={user.id}
                    className="hover:bg-blue-50 cursor-pointer transition-colors duration-150"
                    onClick={() => router.push(`/dashboard/users/${user.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {`${user.firstName} ${user.lastName}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">{user.phone || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user.isActive)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={e => handleEditClick(e, user.id)}
                          className="p-1 rounded-full text-gray-500 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          title="Editar usuário"
                        >
                          <Edit className="h-5 w-5" />
                        </button>

                        <button
                          onClick={e => handleResetPasswordClick(e, user)}
                          className="p-1 rounded-full text-gray-500 hover:text-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                          title="Resetar senha"
                        >
                          <Key className="h-5 w-5" />
                        </button>

                        <button
                          onClick={e => handleToggleActiveClick(e, user)}
                          className={`p-1 rounded-full ${
                            user.isActive
                              ? 'text-gray-500 hover:text-red-700'
                              : 'text-gray-500 hover:text-green-700'
                          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                          title={user.isActive ? 'Desativar usuário' : 'Ativar usuário'}
                        >
                          {user.isActive ? (
                            <PowerOff className="h-5 w-5" />
                          ) : (
                            <Power className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {users.map(user => (
              <div
                key={user.id}
                className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push(`/dashboard/users/${user.id}`)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">
                      {`${user.firstName} ${user.lastName}`}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                    <p className="text-sm text-gray-600">{user.phone || '-'}</p>
                  </div>
                </div>

                <div className="flex gap-2 mb-3">
                  {getRoleBadge(user.role)}
                  {getStatusBadge(user.isActive)}
                </div>

                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={e => handleEditClick(e, user.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors min-h-[44px]"
                    title="Editar"
                  >
                    <Edit className="h-5 w-5" />
                    <span className="text-sm font-medium">Editar</span>
                  </button>

                  <button
                    onClick={e => handleResetPasswordClick(e, user)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-orange-50 text-orange-700 rounded-md hover:bg-orange-100 transition-colors min-h-[44px]"
                    title="Resetar"
                  >
                    <Key className="h-5 w-5" />
                    <span className="text-sm font-medium">Resetar</span>
                  </button>

                  <button
                    onClick={e => handleToggleActiveClick(e, user)}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-colors min-h-[44px] ${
                      user.isActive
                        ? 'bg-red-50 text-red-700 hover:bg-red-100'
                        : 'bg-green-50 text-green-700 hover:bg-green-100'
                    }`}
                    title={user.isActive ? 'Desativar' : 'Ativar'}
                  >
                    {user.isActive ? (
                      <PowerOff className="h-5 w-5" />
                    ) : (
                      <Power className="h-5 w-5" />
                    )}
                    <span className="text-sm font-medium hidden sm:inline">
                      {user.isActive ? 'Desativar' : 'Ativar'}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Dialog de Confirmação - Reset de Senha */}
      <ConfirmDialog
        isOpen={showResetPasswordDialog}
        onClose={() => {
          setShowResetPasswordDialog(false);
          setSelectedUser(null);
        }}
        onConfirm={handleConfirmResetPassword}
        title="Resetar Senha"
        message={`Tem certeza que deseja resetar a senha de ${selectedUser?.firstName} ${selectedUser?.lastName}? A senha será alterada para "senha123".`}
        confirmText="Resetar Senha"
        loading={isProcessing}
        variant="warning"
      />

      {/* Dialog de Confirmação - Ativar/Desativar */}
      <ConfirmDialog
        isOpen={showToggleDialog}
        onClose={() => {
          setShowToggleDialog(false);
          setSelectedUser(null);
        }}
        onConfirm={handleConfirmToggle}
        title={selectedUser?.isActive ? 'Desativar Usuário' : 'Ativar Usuário'}
        message={
          selectedUser?.isActive
            ? `Tem certeza que deseja desativar ${selectedUser?.firstName} ${selectedUser?.lastName}? O usuário não poderá mais fazer login.`
            : `Tem certeza que deseja ativar ${selectedUser?.firstName} ${selectedUser?.lastName}? O usuário poderá fazer login novamente.`
        }
        confirmText={selectedUser?.isActive ? 'Desativar' : 'Ativar'}
        loading={isProcessing}
        variant={selectedUser?.isActive ? 'danger' : 'info'}
      />
    </>
  );
}
