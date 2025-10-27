/**
 * Authorization Middleware e Helpers
 *
 * Higher-order functions para proteção de API routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { user_role } from '@prisma/client';
import {
  hasPermission,
  hasRole,
  SessionWithRole,
  Permission
} from '@/lib/permissions';
import {
  AuthenticationError,
  AuthorizationError
} from '@/lib/errors';
import { handleAPIError } from '@/lib/error-handler';

/**
 * Tipo para handler de API route
 */
type APIRouteHandler = (
  request: NextRequest,
  context: { params?: Record<string, unknown>; session: SessionWithRole }
) => Promise<NextResponse> | NextResponse;

/**
 * Opções de configuração para withAuth
 */
interface WithAuthOptions {
  roles?: user_role[];
  permissions?: Permission[];
  requireAll?: boolean; // Se true, requer todas as permissões; se false, requer pelo menos uma
}

/**
 * Higher-order function que protege API routes com autenticação e autorização
 *
 * @param handler - Handler da API route
 * @param options - Opções de autorização
 * @returns Handler protegido
 *
 * @example
 * ```typescript
 * export const GET = withAuth(
 *   async (req, { session }) => {
 *     // Session está garantida aqui
 *     return NextResponse.json({ data: 'protected' });
 *   },
 *   { roles: ['admin', 'manager'] }
 * );
 * ```
 */
export function withAuth(
  handler: APIRouteHandler,
  options: WithAuthOptions = {}
): (request: NextRequest, context: Record<string, unknown>) => Promise<NextResponse> {
  return async (request: NextRequest, context: Record<string, unknown>) => {
    try {
      // 1. Verificar autenticação
      const session = (await getServerSession(authOptions)) as SessionWithRole | null;

      if (!session || !session.user) {
        throw new AuthenticationError(
          'Você precisa estar autenticado para acessar este recurso'
        );
      }

      // 2. Verificar role (se especificado)
      if (options.roles && options.roles.length > 0) {
        if (!hasRole(session, options.roles)) {
          throw new AuthorizationError(
            `Acesso negado. Roles permitidas: ${options.roles.join(', ')}`,
            options.roles.join(', ')
          );
        }
      }

      // 3. Verificar permissões (se especificado)
      if (options.permissions && options.permissions.length > 0) {
        const hasRequiredPermissions = options.requireAll
          ? options.permissions.every((perm) => hasPermission(session, perm))
          : options.permissions.some((perm) => hasPermission(session, perm));

        if (!hasRequiredPermissions) {
          throw new AuthorizationError(
            'Você não tem permissão para realizar esta ação',
            options.permissions.join(', ')
          );
        }
      }

      // 4. Executar handler com session garantida
      return await handler(request, { ...context, session });
    } catch (error) {
      return handleAPIError(error);
    }
  };
}

/**
 * Shortcut para proteger rotas apenas para admins
 */
export function withAdminAuth(handler: APIRouteHandler) {
  return withAuth(handler, { roles: ['admin'] });
}

/**
 * Shortcut para proteger rotas para admins e managers
 */
export function withManagerAuth(handler: APIRouteHandler) {
  return withAuth(handler, { roles: ['admin', 'manager'] });
}

/**
 * Decorator para verificar permissão específica
 */
export function requirePermission(permission: Permission) {
  return (handler: APIRouteHandler) => {
    return withAuth(handler, { permissions: [permission] });
  };
}

/**
 * Decorator para verificar múltiplas permissões (requer todas)
 */
export function requireAllPermissions(...permissions: Permission[]) {
  return (handler: APIRouteHandler) => {
    return withAuth(handler, { permissions, requireAll: true });
  };
}

/**
 * Decorator para verificar múltiplas permissões (requer pelo menos uma)
 */
export function requireAnyPermission(...permissions: Permission[]) {
  return (handler: APIRouteHandler) => {
    return withAuth(handler, { permissions, requireAll: false });
  };
}

/**
 * Helper para obter session com type-safety
 * Útil para uso em Server Components e Server Actions
 */
export async function getAuthSession(): Promise<SessionWithRole> {
  const session = (await getServerSession(authOptions)) as SessionWithRole | null;

  if (!session || !session.user) {
    throw new AuthenticationError(
      'Você precisa estar autenticado para acessar este recurso'
    );
  }

  return session;
}

/**
 * Helper para verificar se usuário está autenticado
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const session = await getServerSession(authOptions);
    return !!session && !!session.user;
  } catch {
    return false;
  }
}

/**
 * Helper para verificar se usuário tem permissão
 * Retorna null se não autenticado, false se sem permissão, true se tem permissão
 */
export async function checkPermission(
  permission: Permission
): Promise<boolean | null> {
  try {
    const session = (await getServerSession(authOptions)) as SessionWithRole | null;
    if (!session) return null;
    return hasPermission(session, permission);
  } catch {
    return null;
  }
}

/**
 * Helper para verificar se usuário tem role específica
 */
export async function checkRole(role: user_role): Promise<boolean | null> {
  try {
    const session = (await getServerSession(authOptions)) as SessionWithRole | null;
    if (!session) return null;
    return session.user.role === role;
  } catch {
    return null;
  }
}
