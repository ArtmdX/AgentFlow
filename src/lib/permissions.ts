/**
 * Role-Based Access Control System
 *
 * Define permissões e mapeamento para roles (admin, manager, agent)
 */

import { user_role } from '@prisma/client';

/**
 * Enum de permissões do sistema
 */
export enum Permission {
  // Customers
  VIEW_CUSTOMERS = 'view_customers',
  VIEW_ALL_CUSTOMERS = 'view_all_customers', // Ver clientes de todos os agentes
  CREATE_CUSTOMER = 'create_customer',
  UPDATE_CUSTOMER = 'update_customer',
  UPDATE_ANY_CUSTOMER = 'update_any_customer', // Atualizar cliente de qualquer agente
  DELETE_CUSTOMER = 'delete_customer',
  DELETE_ANY_CUSTOMER = 'delete_any_customer',

  // Travels
  VIEW_TRAVELS = 'view_travels',
  VIEW_ALL_TRAVELS = 'view_all_travels', // Ver viagens de todos os agentes
  CREATE_TRAVEL = 'create_travel',
  UPDATE_TRAVEL = 'update_travel',
  UPDATE_ANY_TRAVEL = 'update_any_travel',
  DELETE_TRAVEL = 'delete_travel',
  DELETE_ANY_TRAVEL = 'delete_any_travel',
  CHANGE_TRAVEL_STATUS = 'change_travel_status',

  // Passengers
  VIEW_PASSENGERS = 'view_passengers',
  CREATE_PASSENGER = 'create_passenger',
  UPDATE_PASSENGER = 'update_passenger',
  DELETE_PASSENGER = 'delete_passenger',

  // Payments
  VIEW_PAYMENTS = 'view_payments',
  VIEW_ALL_PAYMENTS = 'view_all_payments',
  CREATE_PAYMENT = 'create_payment',
  UPDATE_PAYMENT = 'update_payment',
  UPDATE_ANY_PAYMENT = 'update_any_payment',
  DELETE_PAYMENT = 'delete_payment',
  DELETE_ANY_PAYMENT = 'delete_any_payment',

  // Reports
  VIEW_REPORTS = 'view_reports',
  VIEW_FINANCIAL_REPORTS = 'view_financial_reports',
  VIEW_GLOBAL_STATS = 'view_global_stats',
  EXPORT_DATA = 'export_data',

  // Users (Admin only)
  VIEW_USERS = 'view_users',
  CREATE_USER = 'create_user',
  UPDATE_USER = 'update_user',
  DELETE_USER = 'delete_user',
  CHANGE_USER_ROLE = 'change_user_role',

  // Settings (Admin only)
  VIEW_SETTINGS = 'view_settings',
  UPDATE_SETTINGS = 'update_settings',

  // Audit (Admin/Manager)
  VIEW_AUDIT_LOG = 'view_audit_log',
  VIEW_ALL_ACTIVITIES = 'view_all_activities',
}

/**
 * Mapeamento de Role → Permissões
 */
export const rolePermissions: Record<user_role, Permission[]> = {
  /**
   * ADMIN - Acesso total ao sistema
   */
  admin: [
    // Customers
    Permission.VIEW_CUSTOMERS,
    Permission.VIEW_ALL_CUSTOMERS,
    Permission.CREATE_CUSTOMER,
    Permission.UPDATE_CUSTOMER,
    Permission.UPDATE_ANY_CUSTOMER,
    Permission.DELETE_CUSTOMER,
    Permission.DELETE_ANY_CUSTOMER,

    // Travels
    Permission.VIEW_TRAVELS,
    Permission.VIEW_ALL_TRAVELS,
    Permission.CREATE_TRAVEL,
    Permission.UPDATE_TRAVEL,
    Permission.UPDATE_ANY_TRAVEL,
    Permission.DELETE_TRAVEL,
    Permission.DELETE_ANY_TRAVEL,
    Permission.CHANGE_TRAVEL_STATUS,

    // Passengers
    Permission.VIEW_PASSENGERS,
    Permission.CREATE_PASSENGER,
    Permission.UPDATE_PASSENGER,
    Permission.DELETE_PASSENGER,

    // Payments
    Permission.VIEW_PAYMENTS,
    Permission.VIEW_ALL_PAYMENTS,
    Permission.CREATE_PAYMENT,
    Permission.UPDATE_PAYMENT,
    Permission.UPDATE_ANY_PAYMENT,
    Permission.DELETE_PAYMENT,
    Permission.DELETE_ANY_PAYMENT,

    // Reports
    Permission.VIEW_REPORTS,
    Permission.VIEW_FINANCIAL_REPORTS,
    Permission.VIEW_GLOBAL_STATS,
    Permission.EXPORT_DATA,

    // Users
    Permission.VIEW_USERS,
    Permission.CREATE_USER,
    Permission.UPDATE_USER,
    Permission.DELETE_USER,
    Permission.CHANGE_USER_ROLE,

    // Settings
    Permission.VIEW_SETTINGS,
    Permission.UPDATE_SETTINGS,

    // Audit
    Permission.VIEW_AUDIT_LOG,
    Permission.VIEW_ALL_ACTIVITIES,
  ],

  /**
   * MANAGER - Pode ver e gerenciar dados de todos os agentes, mas não configurações
   */
  manager: [
    // Customers
    Permission.VIEW_CUSTOMERS,
    Permission.VIEW_ALL_CUSTOMERS,
    Permission.CREATE_CUSTOMER,
    Permission.UPDATE_CUSTOMER,
    Permission.UPDATE_ANY_CUSTOMER,
    Permission.DELETE_CUSTOMER, // Apenas seus próprios
    // Não pode: DELETE_ANY_CUSTOMER

    // Travels
    Permission.VIEW_TRAVELS,
    Permission.VIEW_ALL_TRAVELS,
    Permission.CREATE_TRAVEL,
    Permission.UPDATE_TRAVEL,
    Permission.UPDATE_ANY_TRAVEL,
    Permission.DELETE_TRAVEL, // Apenas suas próprias
    Permission.CHANGE_TRAVEL_STATUS,
    // Não pode: DELETE_ANY_TRAVEL

    // Passengers
    Permission.VIEW_PASSENGERS,
    Permission.CREATE_PASSENGER,
    Permission.UPDATE_PASSENGER,
    Permission.DELETE_PASSENGER,

    // Payments
    Permission.VIEW_PAYMENTS,
    Permission.VIEW_ALL_PAYMENTS,
    Permission.CREATE_PAYMENT,
    Permission.UPDATE_PAYMENT,
    Permission.UPDATE_ANY_PAYMENT,
    Permission.DELETE_PAYMENT,
    // Não pode: DELETE_ANY_PAYMENT

    // Reports
    Permission.VIEW_REPORTS,
    Permission.VIEW_FINANCIAL_REPORTS,
    Permission.VIEW_GLOBAL_STATS,
    Permission.EXPORT_DATA,

    // Audit
    Permission.VIEW_ALL_ACTIVITIES,
    // Não pode: VIEW_AUDIT_LOG (completo)
  ],

  /**
   * AGENT - Acesso apenas aos próprios dados
   */
  agent: [
    // Customers
    Permission.VIEW_CUSTOMERS, // Apenas seus próprios
    Permission.CREATE_CUSTOMER,
    Permission.UPDATE_CUSTOMER, // Apenas seus próprios
    Permission.DELETE_CUSTOMER, // Apenas seus próprios

    // Travels
    Permission.VIEW_TRAVELS, // Apenas suas próprias
    Permission.CREATE_TRAVEL,
    Permission.UPDATE_TRAVEL, // Apenas suas próprias
    Permission.DELETE_TRAVEL, // Apenas suas próprias
    Permission.CHANGE_TRAVEL_STATUS,

    // Passengers
    Permission.VIEW_PASSENGERS, // Apenas de suas viagens
    Permission.CREATE_PASSENGER,
    Permission.UPDATE_PASSENGER,
    Permission.DELETE_PASSENGER,

    // Payments
    Permission.VIEW_PAYMENTS, // Apenas de suas viagens
    Permission.CREATE_PAYMENT,
    Permission.UPDATE_PAYMENT, // Apenas suas próprias
    Permission.DELETE_PAYMENT, // Apenas suas próprias

    // Reports
    Permission.VIEW_REPORTS, // Apenas seus próprios dados
    Permission.EXPORT_DATA,
  ],
};

/**
 * Tipo para Session estendida com role
 */
export interface SessionWithRole {
  user: {
    id: string;
    email: string;
    name?: string;
    role: user_role;
  };
}

/**
 * Verifica se um usuário tem uma permissão específica
 */
export function hasPermission(
  session: SessionWithRole | null,
  permission: Permission
): boolean {
  if (!session?.user?.role) return false;

  const permissions = rolePermissions[session.user.role];
  return permissions.includes(permission);
}

/**
 * Verifica se um usuário tem pelo menos uma das permissões
 */
export function hasAnyPermission(
  session: SessionWithRole | null,
  permissions: Permission[]
): boolean {
  if (!session?.user?.role) return false;

  return permissions.some((permission) => hasPermission(session, permission));
}

/**
 * Verifica se um usuário tem todas as permissões
 */
export function hasAllPermissions(
  session: SessionWithRole | null,
  permissions: Permission[]
): boolean {
  if (!session?.user?.role) return false;

  return permissions.every((permission) => hasPermission(session, permission));
}

/**
 * Verifica se um usuário tem uma das roles especificadas
 */
export function hasRole(
  session: SessionWithRole | null,
  roles: user_role[]
): boolean {
  if (!session?.user?.role) return false;

  return roles.includes(session.user.role);
}

/**
 * Verifica se o usuário é admin
 */
export function isAdmin(session: SessionWithRole | null): boolean {
  return session?.user?.role === 'admin';
}

/**
 * Verifica se o usuário é manager ou admin
 */
export function isManagerOrAbove(session: SessionWithRole | null): boolean {
  return hasRole(session, ['admin', 'manager']);
}

/**
 * Retorna todas as permissões de um role
 */
export function getRolePermissions(role: user_role): Permission[] {
  return rolePermissions[role];
}

/**
 * Helper para verificar se usuário pode acessar recurso de outro usuário
 */
export function canAccessUserResource(
  session: SessionWithRole | null,
  resourceOwnerId: string,
  viewAllPermission: Permission
): boolean {
  if (!session?.user?.id) return false;

  // Se for o próprio usuário, pode acessar
  if (session.user.id === resourceOwnerId) return true;

  // Se tem permissão de ver todos, pode acessar
  return hasPermission(session, viewAllPermission);
}

/**
 * Helper para verificar se usuário pode modificar recurso de outro usuário
 */
export function canModifyUserResource(
  session: SessionWithRole | null,
  resourceOwnerId: string,
  modifyOwnPermission: Permission,
  modifyAnyPermission: Permission
): boolean {
  if (!session?.user?.id) return false;

  // Se for o próprio usuário, verifica permissão de modificar próprio
  if (session.user.id === resourceOwnerId) {
    return hasPermission(session, modifyOwnPermission);
  }

  // Se for de outro usuário, verifica permissão de modificar qualquer
  return hasPermission(session, modifyAnyPermission);
}
