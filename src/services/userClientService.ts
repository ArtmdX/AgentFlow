import type { CreateUserInput, UpdateUserInput, UpdateProfileInput, ChangePasswordInput, AdminResetPasswordInput, ForgotPasswordInput, ResetPasswordInput } from '@/lib/validations/user';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: 'admin' | 'manager' | 'agent';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== CRUD de Usuários (Admin/Manager) ====================

export async function getUsers(): Promise<{ users: User[] } | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Erro ao buscar usuários:', error);
      throw new Error(error.error || 'Falha ao buscar usuários');
    }

    return response.json();
  } catch (error) {
    console.error('Erro no serviço de listagem de usuários:', error);
    return null;
  }
}

export async function getUser(userId: string): Promise<User | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Erro ao buscar usuário:', error);
      throw new Error(error.error || 'Falha ao buscar usuário');
    }

    return response.json();
  } catch (error) {
    console.error('Erro no serviço de busca de usuário:', error);
    return null;
  }
}

export async function createUser(userData: CreateUserInput): Promise<User | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Erro ao criar usuário:', error);
      throw new Error(error.error || 'Falha ao criar usuário');
    }

    return response.json();
  } catch (error) {
    console.error('Erro no serviço de criação de usuário:', error);
    return null;
  }
}

export async function updateUser(userId: string, userData: UpdateUserInput): Promise<User | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Erro ao atualizar usuário:', error);
      throw new Error(error.error || 'Falha ao atualizar usuário');
    }

    return response.json();
  } catch (error) {
    console.error('Erro no serviço de atualização de usuário:', error);
    return null;
  }
}

export async function toggleUserActive(userId: string): Promise<{ user: User; message: string } | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/toggle-active`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Erro ao ativar/desativar usuário:', error);
      throw new Error(error.error || 'Falha ao ativar/desativar usuário');
    }

    return response.json();
  } catch (error) {
    console.error('Erro no serviço de ativação/desativação de usuário:', error);
    return null;
  }
}

export async function adminResetPassword(userId: string, passwordData: AdminResetPasswordInput): Promise<{ message: string } | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/reset-password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(passwordData)
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Erro ao resetar senha:', error);
      throw new Error(error.error || 'Falha ao resetar senha');
    }

    return response.json();
  } catch (error) {
    console.error('Erro no serviço de reset de senha:', error);
    return null;
  }
}

// ==================== Perfil do Usuário Logado ====================

export async function getProfile(): Promise<User | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Erro ao buscar perfil:', error);
      throw new Error(error.error || 'Falha ao buscar perfil');
    }

    return response.json();
  } catch (error) {
    console.error('Erro no serviço de busca de perfil:', error);
    return null;
  }
}

export async function updateProfile(profileData: UpdateProfileInput): Promise<User | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profileData)
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Erro ao atualizar perfil:', error);
      throw new Error(error.error || 'Falha ao atualizar perfil');
    }

    return response.json();
  } catch (error) {
    console.error('Erro no serviço de atualização de perfil:', error);
    return null;
  }
}

export async function changePassword(passwordData: ChangePasswordInput): Promise<{ message: string } | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/profile/password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(passwordData)
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Erro ao alterar senha:', error);
      throw new Error(error.error || 'Falha ao alterar senha');
    }

    return response.json();
  } catch (error) {
    console.error('Erro no serviço de alteração de senha:', error);
    return null;
  }
}

// ==================== Recuperação de Senha ====================

export async function forgotPassword(emailData: ForgotPasswordInput): Promise<{ message: string } | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Erro ao solicitar recuperação de senha:', error);
      throw new Error(error.error || 'Falha ao solicitar recuperação de senha');
    }

    return response.json();
  } catch (error) {
    console.error('Erro no serviço de recuperação de senha:', error);
    return null;
  }
}

export async function resetPassword(resetData: ResetPasswordInput): Promise<{ message: string } | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(resetData)
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Erro ao redefinir senha:', error);
      throw new Error(error.error || 'Falha ao redefinir senha');
    }

    return response.json();
  } catch (error) {
    console.error('Erro no serviço de redefinição de senha:', error);
    return null;
  }
}
