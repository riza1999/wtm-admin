import { useAuthorization } from "@/hooks/use-authorization";
import type { UserRole } from "@/lib/authorization";
import React from "react";

interface AuthorizationGuardProps {
  children: React.ReactNode;
  requiredRole?: UserRole | UserRole[];
  minimumRole?: UserRole;
  fallback?: React.ReactNode;
  showLoading?: boolean;
}

/**
 * Component that conditionally renders children based on user authorization
 *
 * @example
 * // Only show to super admin
 * <AuthorizationGuard requiredRole="super_admin">
 *   <SuperAdminOnlyFeature />
 * </AuthorizationGuard>
 *
 * @example
 * // Show to admin or super admin
 * <AuthorizationGuard requiredRole={["admin", "super_admin"]}>
 *   <AdminFeature />
 * </AuthorizationGuard>
 *
 * @example
 * // Show to admin and above (includes super admin)
 * <AuthorizationGuard minimumRole="admin">
 *   <AdminAndAboveFeature />
 * </AuthorizationGuard>
 */
export function AuthorizationGuard({
  children,
  requiredRole,
  minimumRole,
  fallback = null,
  showLoading = false,
}: AuthorizationGuardProps) {
  const { hasRole, hasMinimumRole, isLoading } = useAuthorization();

  if (isLoading && showLoading) {
    return <>{fallback}</>;
  }

  if (isLoading) {
    return null;
  }

  // Check required role if specified
  if (requiredRole && !hasRole(requiredRole)) {
    return <>{fallback}</>;
  }

  // Check minimum role if specified
  if (minimumRole && !hasMinimumRole(minimumRole)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
