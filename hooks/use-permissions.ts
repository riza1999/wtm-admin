/**
 * Client-side hooks for permission checking
 *
 * These hooks use NextAuth's useSession to check permissions
 * in React components.
 */

"use client";

import { useSession } from "next-auth/react";
import { useMemo } from "react";
import type { Permission } from "@/types/permissions";
import {
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  hasResourcePermission,
  getResourcePermissions,
  canRead,
  canCreate,
  canUpdate,
  canDelete,
} from "@/lib/permissions";

/**
 * Hook to access user permissions
 */
export function usePermissions() {
  const { data: session, status } = useSession();
  const permissions = session?.user?.permissions ?? [];

  return {
    permissions,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
  };
}

/**
 * Hook to check if user has a specific permission
 */
export function useHasPermission(requiredPermission: Permission): boolean {
  const { permissions } = usePermissions();
  return useMemo(
    () => hasPermission(permissions, requiredPermission),
    [permissions, requiredPermission]
  );
}

/**
 * Hook to check if user has all specified permissions
 */
export function useHasAllPermissions(
  requiredPermissions: Permission[]
): boolean {
  const { permissions } = usePermissions();
  return useMemo(
    () => hasAllPermissions(permissions, requiredPermissions),
    [permissions, requiredPermissions]
  );
}

/**
 * Hook to check if user has any of the specified permissions
 */
export function useHasAnyPermission(
  requiredPermissions: Permission[]
): boolean {
  const { permissions } = usePermissions();
  return useMemo(
    () => hasAnyPermission(permissions, requiredPermissions),
    [permissions, requiredPermissions]
  );
}

/**
 * Hook to check resource-specific permissions
 */
export function useResourcePermissions(resource: string) {
  const { permissions } = usePermissions();

  return useMemo(
    () => ({
      permissions: getResourcePermissions(permissions, resource),
      canRead: canRead(permissions, resource),
      canCreate: canCreate(permissions, resource),
      canUpdate: canUpdate(permissions, resource),
      canDelete: canDelete(permissions, resource),
      hasPermission: (action: string) =>
        hasResourcePermission(permissions, resource, action),
    }),
    [permissions, resource]
  );
}

/**
 * Hook to get user role information
 */
export function useRole() {
  const { data: session } = useSession();

  return {
    role: session?.user?.role,
    roleId: session?.user?.role_id,
    isRole: (roleName: string) =>
      session?.user?.role?.toLowerCase() === roleName.toLowerCase(),
  };
}

/**
 * Hook to get current user information
 */
export function useCurrentUser() {
  const { data: session, status } = useSession();

  return {
    user: session?.user,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
  };
}
