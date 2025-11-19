/**
 * Permission-based rendering components
 *
 * These components conditionally render their children based on
 * user permissions.
 */

"use client";

import type { ReactNode } from "react";
import type { Permission } from "@/types/permissions";
import {
  useHasPermission,
  useHasAllPermissions,
  useHasAnyPermission,
  usePermissions,
} from "@/hooks/use-permissions";

interface CanProps {
  /**
   * Single permission required to render children
   */
  permission?: Permission;
  /**
   * All of these permissions are required to render children
   */
  allPermissions?: Permission[];
  /**
   * Any of these permissions are required to render children
   */
  anyPermissions?: Permission[];
  /**
   * Content to render when user has permission
   */
  children: ReactNode;
  /**
   * Optional fallback content when user doesn't have permission
   */
  fallback?: ReactNode;
}

/**
 * Conditionally render children based on permissions
 *
 * @example
 * // Single permission
 * <Can permission="hotel:update">
 *   <Button>Edit Hotel</Button>
 * </Can>
 *
 * @example
 * // All permissions required
 * <Can allPermissions={["hotel:read", "hotel:update"]}>
 *   <HotelEditor />
 * </Can>
 *
 * @example
 * // Any permission
 * <Can anyPermissions={["hotel:read", "hotel:update"]} fallback={<div>No access</div>}>
 *   <HotelView />
 * </Can>
 */
export function Can({
  permission,
  allPermissions,
  anyPermissions,
  children,
  fallback = null,
}: CanProps) {
  const hasSinglePermission = useHasPermission(permission!);
  const hasAll = useHasAllPermissions(allPermissions ?? []);
  const hasAny = useHasAnyPermission(anyPermissions ?? []);

  // Determine if user has required permissions
  let hasAccess = true;

  if (permission) {
    hasAccess = hasSinglePermission;
  } else if (allPermissions && allPermissions.length > 0) {
    hasAccess = hasAll;
  } else if (anyPermissions && anyPermissions.length > 0) {
    hasAccess = hasAny;
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}

interface CannotProps {
  /**
   * Single permission that blocks rendering
   */
  permission?: Permission;
  /**
   * If user has all these permissions, don't render
   */
  allPermissions?: Permission[];
  /**
   * If user has any of these permissions, don't render
   */
  anyPermissions?: Permission[];
  /**
   * Content to render when user does NOT have permission
   */
  children: ReactNode;
  /**
   * Optional fallback content when user HAS permission
   */
  fallback?: ReactNode;
}

/**
 * Inverse of Can - render children when user does NOT have permission
 *
 * @example
 * <Cannot permission="hotel:delete">
 *   <p>You cannot delete hotels</p>
 * </Cannot>
 */
export function Cannot({
  permission,
  allPermissions,
  anyPermissions,
  children,
  fallback = null,
}: CannotProps) {
  const hasSinglePermission = useHasPermission(permission!);
  const hasAll = useHasAllPermissions(allPermissions ?? []);
  const hasAny = useHasAnyPermission(anyPermissions ?? []);

  // Determine if user has the permissions (inverse logic)
  let hasAccess = false;

  if (permission) {
    hasAccess = hasSinglePermission;
  } else if (allPermissions && allPermissions.length > 0) {
    hasAccess = hasAll;
  } else if (anyPermissions && anyPermissions.length > 0) {
    hasAccess = hasAny;
  }

  return !hasAccess ? <>{children}</> : <>{fallback}</>;
}

interface ShowForPermissionsProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Only show children when user is authenticated and has permissions
 */
export function ShowForAuthenticated({
  children,
  fallback = null,
}: ShowForPermissionsProps) {
  const { isAuthenticated, isLoading } = usePermissions();

  if (isLoading) {
    return null;
  }

  return isAuthenticated ? <>{children}</> : <>{fallback}</>;
}

/**
 * Show different content based on authentication status
 */
export function ShowByAuth({
  authenticated,
  unauthenticated = null,
}: {
  authenticated: ReactNode;
  unauthenticated?: ReactNode;
}) {
  const { isAuthenticated, isLoading } = usePermissions();

  if (isLoading) {
    return null;
  }

  return isAuthenticated ? <>{authenticated}</> : <>{unauthenticated}</>;
}
