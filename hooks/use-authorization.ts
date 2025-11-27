import {
  hasMinimumRole,
  hasRole,
  isAdmin,
  isSuperAdmin,
  type UserRole,
} from "@/lib/authorization";
import { useSession } from "next-auth/react";
import { useMemo } from "react";

/**
 * Custom hook for handling authorization checks
 * @returns Authorization utilities and user role information
 */
export function useAuthorization() {
  const { data: session, status } = useSession();
  const userRole = session?.user?.role;

  const authorization = useMemo(() => {
    return {
      // User information
      userRole,
      isAuthenticated: status === "authenticated",
      isLoading: status === "loading",

      // Role checks
      hasRole: (requiredRole: UserRole | UserRole[]) =>
        hasRole(userRole, requiredRole),
      isSuperAdmin: () => isSuperAdmin(userRole),
      isAdmin: () => isAdmin(userRole),
      hasMinimumRole: (minimumRole: UserRole) =>
        hasMinimumRole(userRole, minimumRole),

      // Convenience checks
      canAccessSuperAdminOnly: () => isSuperAdmin(userRole),
      canAccessAdminAndAbove: () => isAdmin(userRole),
    };
  }, [userRole, status]);

  return authorization;
}
