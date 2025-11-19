/**
 * Permission utilities for RBAC
 *
 * This module provides utilities for checking user permissions
 * both on the server and client side.
 */

import type { Permission } from "@/types/permissions";
import type { Session } from "next-auth";

/**
 * Check if a user has a specific permission
 */
export function hasPermission(
  userPermissions: Permission[] | undefined | null,
  requiredPermission: Permission
): boolean {
  if (!userPermissions || !Array.isArray(userPermissions)) {
    return false;
  }
  return userPermissions.includes(requiredPermission);
}

/**
 * Check if a user has ALL of the specified permissions
 */
export function hasAllPermissions(
  userPermissions: Permission[] | undefined | null,
  requiredPermissions: Permission[]
): boolean {
  if (!userPermissions || !Array.isArray(userPermissions)) {
    return false;
  }
  return requiredPermissions.every((permission) =>
    userPermissions.includes(permission)
  );
}

/**
 * Check if a user has ANY of the specified permissions
 */
export function hasAnyPermission(
  userPermissions: Permission[] | undefined | null,
  requiredPermissions: Permission[]
): boolean {
  if (!userPermissions || !Array.isArray(userPermissions)) {
    return false;
  }
  return requiredPermissions.some((permission) =>
    userPermissions.includes(permission)
  );
}

/**
 * Check if a user has permission for a resource action
 * @example hasResourcePermission(permissions, 'hotel', 'update')
 */
export function hasResourcePermission(
  userPermissions: Permission[] | undefined | null,
  resource: string,
  action: string
): boolean {
  const permission = `${resource}:${action}` as Permission;
  return hasPermission(userPermissions, permission);
}

/**
 * Get all permissions for a specific resource
 */
export function getResourcePermissions(
  userPermissions: Permission[] | undefined | null,
  resource: string
): Permission[] {
  if (!userPermissions || !Array.isArray(userPermissions)) {
    return [];
  }
  return userPermissions.filter((permission) =>
    permission.startsWith(`${resource}:`)
  );
}

/**
 * Check if user can read a resource
 */
export function canRead(
  userPermissions: Permission[] | undefined | null,
  resource: string
): boolean {
  return hasResourcePermission(userPermissions, resource, "read");
}

/**
 * Check if user can create a resource
 */
export function canCreate(
  userPermissions: Permission[] | undefined | null,
  resource: string
): boolean {
  return hasResourcePermission(userPermissions, resource, "create");
}

/**
 * Check if user can update a resource
 */
export function canUpdate(
  userPermissions: Permission[] | undefined | null,
  resource: string
): boolean {
  return hasResourcePermission(userPermissions, resource, "update");
}

/**
 * Check if user can delete a resource
 */
export function canDelete(
  userPermissions: Permission[] | undefined | null,
  resource: string
): boolean {
  return hasResourcePermission(userPermissions, resource, "delete");
}

/**
 * Server-side: Check if user in session has permission
 */
export function sessionHasPermission(
  session: Session | null,
  requiredPermission: Permission
): boolean {
  return hasPermission(session?.user?.permissions, requiredPermission);
}

/**
 * Server-side: Check if user in session has all permissions
 */
export function sessionHasAllPermissions(
  session: Session | null,
  requiredPermissions: Permission[]
): boolean {
  return hasAllPermissions(session?.user?.permissions, requiredPermissions);
}

/**
 * Server-side: Check if user in session has any permission
 */
export function sessionHasAnyPermission(
  session: Session | null,
  requiredPermissions: Permission[]
): boolean {
  return hasAnyPermission(session?.user?.permissions, requiredPermissions);
}

/**
 * Get user permissions from session
 */
export function getSessionPermissions(session: Session | null): Permission[] {
  return session?.user?.permissions ?? [];
}

/**
 * Check if user is in a specific role
 */
export function hasRole(session: Session | null, roleName: string): boolean {
  return session?.user?.role?.toLowerCase() === roleName.toLowerCase();
}

/**
 * Check if user is in any of the specified roles
 */
export function hasAnyRole(
  session: Session | null,
  roleNames: string[]
): boolean {
  const userRole = session?.user?.role?.toLowerCase();
  return roleNames.some((role) => role.toLowerCase() === userRole);
}
