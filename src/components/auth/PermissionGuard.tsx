'use client';

/**
 * Permission Guard Component
 *
 * Componente para ocultar elementos baseado em permissões
 */

import React from 'react';
import { Permission } from '@/lib/permissions';
import { usePermissions } from '@/hooks/usePermissions';
import { user_role } from '@prisma/client';

interface PermissionGuardProps {
  children: React.ReactNode;
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean; // Se true, requer todas as permissões; se false, requer pelo menos uma
  role?: user_role;
  roles?: user_role[];
  fallback?: React.ReactNode;
}

/**
 * Componente que renderiza children apenas se o usuário tiver as permissões necessárias
 */
export function PermissionGuard({
  children,
  permission,
  permissions,
  requireAll = false,
  role,
  roles,
  fallback = null,
}: PermissionGuardProps) {
  const { checkPermission, checkRole } = usePermissions();

  // Verificar permissão única
  if (permission && !checkPermission(permission)) {
    return <>{fallback}</>;
  }

  // Verificar múltiplas permissões
  if (permissions && permissions.length > 0) {
    const hasRequiredPermissions = requireAll
      ? permissions.every((perm) => checkPermission(perm))
      : permissions.some((perm) => checkPermission(perm));

    if (!hasRequiredPermissions) {
      return <>{fallback}</>;
    }
  }

  // Verificar role única
  if (role && !checkRole([role])) {
    return <>{fallback}</>;
  }

  // Verificar múltiplas roles
  if (roles && roles.length > 0 && !checkRole(roles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Shortcut para guard apenas admin
 */
export function AdminOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <PermissionGuard role="admin" fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}

/**
 * Shortcut para guard admin ou manager
 */
export function ManagerOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <PermissionGuard roles={['admin', 'manager']} fallback={fallback}>
      {children}
    </PermissionGuard>
  );
}
