/**
 * ==============================================================================
 * VARAH SYSTEMS — ROLE-BASED ACCESS CONTROL (RBAC) MATRIX
 * Enforces zero-trust server-side authorization across all admin resources
 * ==============================================================================
 */

import type { UserRole, PermissionAction, PermissionResource, AdminSession } from '@/types/admin';

type RolePermissions = Record<UserRole, Partial<Record<PermissionResource, PermissionAction[]>>>;

export const ROLE_PERMISSIONS: RolePermissions = {
  OWNER: {
    leads: ['view', 'create', 'edit', 'delete', 'export'],
    clients: ['view', 'create', 'edit', 'delete', 'export'],
    projects: ['view', 'create', 'edit', 'delete', 'export'],
    cms: ['view', 'create', 'edit', 'delete', 'export'],
    media: ['view', 'create', 'edit', 'delete', 'export'],
    analytics: ['view', 'export'],
    newsletter: ['view', 'create', 'edit', 'delete', 'export'],
    settings: ['view', 'edit', 'manage_settings'],
    team: ['view', 'create', 'edit', 'delete', 'manage_team'],
    audit: ['view', 'view_audit_logs', 'export'],
  },
  ADMIN: {
    leads: ['view', 'create', 'edit', 'delete', 'export'],
    clients: ['view', 'create', 'edit', 'delete', 'export'],
    projects: ['view', 'create', 'edit', 'delete', 'export'],
    cms: ['view', 'create', 'edit', 'delete', 'export'],
    media: ['view', 'create', 'edit', 'delete', 'export'],
    analytics: ['view', 'export'],
    newsletter: ['view', 'create', 'edit', 'delete', 'export'],
    settings: ['view', 'edit', 'manage_settings'],
    team: ['view', 'create', 'edit'], // Cannot delete team members or transfer ownership
    audit: ['view', 'view_audit_logs'],
  },
  EDITOR: {
    leads: ['view', 'create', 'edit'],
    clients: ['view', 'create', 'edit'],
    projects: ['view', 'create', 'edit'],
    cms: ['view', 'create', 'edit', 'delete'],
    media: ['view', 'create', 'edit', 'delete'],
    analytics: ['view'],
    newsletter: ['view', 'create', 'edit'],
    settings: ['view'],
    team: ['view'],
    audit: [],
  },
  VIEWER: {
    leads: ['view'],
    clients: ['view'],
    projects: ['view'],
    cms: ['view'],
    media: ['view'],
    analytics: ['view'],
    newsletter: ['view'],
    settings: [],
    team: [],
    audit: [],
  },
};

/**
 * Pure predicate to verify if a role has permission for a resource and action
 */
export function hasPermission(
  role: UserRole,
  resource: PermissionResource,
  action: PermissionAction
): boolean {
  const allowedActions = ROLE_PERMISSIONS[role]?.[resource];
  if (!allowedActions) return false;
  return allowedActions.includes(action);
}

/**
 * Server-side assertion guard to call at the top of Server Actions and API routes
 * Throws a typed Error if authorization check fails
 */
export function assertPermission(
  session: AdminSession | null,
  resource: PermissionResource,
  action: PermissionAction
): AdminSession {
  if (!session) {
    throw new Error('UNAUTHORIZED: You must be signed in to perform this action.');
  }

  const allowed = hasPermission(session.user.role, resource, action);
  if (!allowed) {
    throw new Error(
      `FORBIDDEN: Role '${session.user.role}' lacks permission '${action}' on '${resource}'.`
    );
  }

  return session;
}
