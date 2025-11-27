/**
 * Server-side authorization utilities for protecting pages
 *
 * This module provides reusable functions for implementing role-based access control
 * in Next.js server components. It automatically redirects unauthorized users to a
 * dedicated access denied page.
 *
 * @example Basic usage in a protected page:
 * ```tsx
 * import { requireAuthorization } from "@/lib/server-authorization";
 *
 * export default async function ProtectedPage() {
 *   // Only Super Admin can access
 *   await requireAuthorization({ requiredRole: "Super Admin" });
 *
 *   return <div>Super Admin Only Content</div>;
 * }
 * ```
 *
 * @example Multiple roles allowed:
 * ```tsx
 * await requireAuthorization({ requiredRole: ["Admin", "Super Admin"] });
 * ```
 *
 * @example Minimum role hierarchy:
 * ```tsx
 * // Allows Admin and Super Admin (higher privilege levels)
 * await requireAuthorization({ minimumRole: "Admin" });
 * ```
 */

import authOptions from "@/lib/auth";
import { type UserRole, hasRole, hasMinimumRole } from "@/lib/authorization";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export interface AuthorizationCheckOptions {
  /**
   * Specific role(s) required to access the page
   */
  requiredRole?: UserRole | UserRole[];
  /**
   * Minimum role level required (includes higher privilege roles)
   */
  minimumRole?: UserRole;
  /**
   * URL to redirect to if unauthorized (default: "/unauthorized")
   */
  redirectUrl?: string;
}

/**
 * Server-side function to check user authorization and redirect if unauthorized
 *
 * @example
 * // Require Super Admin role
 * await requireAuthorization({ requiredRole: "Super Admin" });
 *
 * @example
 * // Require Admin or Super Admin
 * await requireAuthorization({ requiredRole: ["Admin", "Super Admin"] });
 *
 * @example
 * // Require at least Admin level (includes Super Admin)
 * await requireAuthorization({ minimumRole: "Admin" });
 *
 * @throws Redirects to unauthorized page if user doesn't have required permissions
 */
export async function requireAuthorization(
  options: AuthorizationCheckOptions
): Promise<void> {
  const session = await getServerSession(authOptions);
  const userRole = session?.user?.role;
  const redirectUrl = options.redirectUrl ?? "/unauthorized";

  // Check required role if specified
  if (options.requiredRole) {
    if (!hasRole(userRole, options.requiredRole)) {
      redirect(redirectUrl);
    }
  }

  // Check minimum role if specified
  if (options.minimumRole) {
    if (!hasMinimumRole(userRole, options.minimumRole)) {
      redirect(redirectUrl);
    }
  }
}

/**
 * Get user session and role information
 *
 * @returns Session with user role or null if not authenticated
 */
export async function getUserSession() {
  const session = await getServerSession(authOptions);
  return {
    session,
    userRole: session?.user?.role,
    isAuthenticated: !!session,
  };
}

/**
 * Check if current user has a specific role (without redirecting)
 *
 * @returns true if user has the required role, false otherwise
 */
export async function checkUserHasRole(
  requiredRole: UserRole | UserRole[]
): Promise<boolean> {
  const { userRole } = await getUserSession();
  return hasRole(userRole, requiredRole);
}

/**
 * Check if current user meets minimum role requirement (without redirecting)
 *
 * @returns true if user meets minimum role, false otherwise
 */
export async function checkUserHasMinimumRole(
  minimumRole: UserRole
): Promise<boolean> {
  const { userRole } = await getUserSession();
  return hasMinimumRole(userRole, minimumRole);
}
