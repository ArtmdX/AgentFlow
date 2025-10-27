'use client';

/**
 * usePermissions Hook
 *
 * Hook para verificar permissões no client-side
 */

import { useSession } from 'next-auth/react';
import { Permission, hasPermission, hasRole, SessionWithRole } from '@/lib/permissions';
import { user_role } from '@prisma/client';

export function usePermissions() {
  const { data: session } = useSession();

  const checkPermission = (permission: Permission): boolean => {
    if (!session) return false;
    return hasPermission(session as SessionWithRole, permission);
  };

  const checkRole = (roles: user_role[]): boolean => {
    if (!session) return false;
    return hasRole(session as SessionWithRole, roles);
  };

  const isAdmin = (): boolean => {
    return checkRole(['admin']);
  };

  const isManager = (): boolean => {
    return checkRole(['manager']);
  };

  const isAgent = (): boolean => {
    return checkRole(['agent']);
  };

  const isManagerOrAbove = (): boolean => {
    return checkRole(['admin', 'manager']);
  };

  return {
    checkPermission,
    checkRole,
    isAdmin,
    isManager,
    isAgent,
    isManagerOrAbove,
    session: session as SessionWithRole | null,
  };
}
