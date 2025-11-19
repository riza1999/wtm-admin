/**
 * Server-side permission utilities
 *
 * Use these utilities in server components, API routes, and server actions
 * to check permissions before performing operations.
 */

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { Permission } from "@/types/permissions";
import {
  sessionHasPermission,
  sessionHasAllPermissions,
} from "@/lib/permissions";
import { redirect } from "next/navigation";

/**
 * Get the current session on the server
 */
export async function getSession() {
  return await getServerSession(authOptions);
}

/**
 * Get current user permissions
 */
export async function getCurrentUserPermissions(): Promise<Permission[]> {
  const session = await getSession();
  return session?.user?.permissions ?? [];
}

/**
 * Check if current user has a specific permission
 * @throws {Error} if user doesn't have permission
 */
export async function requirePermission(
  requiredPermission: Permission
): Promise<void> {
  const session = await getSession();

  if (!sessionHasPermission(session, requiredPermission)) {
    throw new Error(`Unauthorized: Missing permission ${requiredPermission}`);
  }
}

/**
 * Check if current user has all specified permissions
 * @throws {Error} if user doesn't have all permissions
 */
export async function requireAllPermissions(
  requiredPermissions: Permission[]
): Promise<void> {
  const session = await getSession();

  if (!sessionHasAllPermissions(session, requiredPermissions)) {
    throw new Error(
      `Unauthorized: Missing permissions ${requiredPermissions.join(", ")}`
    );
  }
}

/**
 * Verify permission and redirect to access denied page if not authorized
 */
export async function verifyPermissionOrRedirect(
  requiredPermission: Permission,
  redirectTo: string = "/access-denied"
): Promise<void> {
  const session = await getSession();

  if (!sessionHasPermission(session, requiredPermission)) {
    redirect(redirectTo);
  }
}

/**
 * Check permission without throwing
 */
export async function checkPermission(
  requiredPermission: Permission
): Promise<boolean> {
  const session = await getSession();
  return sessionHasPermission(session, requiredPermission);
}

/**
 * Get current user info
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}

/**
 * Require authentication
 * @throws {Error} if user is not authenticated
 */
export async function requireAuth() {
  const session = await getSession();

  if (!session?.user) {
    throw new Error("Unauthorized: Authentication required");
  }

  return session;
}

/**
 * API route permission guard
 * Returns a standardized JSON error response
 */
export async function guardApiRoute(requiredPermission: Permission) {
  const session = await getSession();

  if (!session?.user) {
    return {
      authorized: false,
      response: new Response(
        JSON.stringify({
          status: 401,
          message: "Unauthorized: Authentication required",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      ),
    };
  }

  if (!sessionHasPermission(session, requiredPermission)) {
    return {
      authorized: false,
      response: new Response(
        JSON.stringify({
          status: 403,
          message: `Forbidden: Missing permission ${requiredPermission}`,
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      ),
    };
  }

  return { authorized: true, session };
}
