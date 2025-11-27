/**
 * Authorization utilities for role-based access control
 */

export type UserRole = "Super Admin" | "Admin" | "Support";

/**
 * Normalize role string to handle variations and return exact UserRole string
 */
export function normalizeRole(role: string | undefined | null): string {
  if (!role) return "";

  // Normalize the input to a consistent format
  const normalized = role.trim();

  // Map variations to exact role strings
  const roleMap: Record<string, string> = {
    "super admin": "Super Admin",
    super_admin: "Super Admin",
    superadmin: "Super Admin",
    admin: "Admin",
    support: "Support",
  };

  const lowerCaseNormalized = normalized.toLowerCase().replace(/\s+/g, " ");
  return roleMap[lowerCaseNormalized] || normalized;
}

/**
 * Check if user has a specific role
 */
export function hasRole(
  userRole: string | undefined | null,
  requiredRole: UserRole | UserRole[]
): boolean {
  const normalized = normalizeRole(userRole);

  if (Array.isArray(requiredRole)) {
    return requiredRole.some((role) => normalizeRole(role) === normalized);
  }

  return normalizeRole(requiredRole) === normalized;
}

/**
 * Check if user is a super admin
 */
export function isSuperAdmin(userRole: string | undefined | null): boolean {
  return hasRole(userRole, "Super Admin");
}

/**
 * Check if user is an admin (includes super admin)
 */
export function isAdmin(userRole: string | undefined | null): boolean {
  return hasRole(userRole, ["Super Admin", "Admin"]);
}

/**
 * Check if user has any of the admin roles
 */
export function hasAnyAdminRole(userRole: string | undefined | null): boolean {
  return hasRole(userRole, ["Super Admin", "Admin"]);
}

/**
 * Check if user has permission based on role hierarchy
 * Super Admin (1) > Admin (2) > Support (3)
 * Lower number = higher privilege
 */
export function hasMinimumRole(
  userRole: string | undefined | null,
  minimumRole: UserRole
): boolean {
  const normalized = normalizeRole(userRole);
  const roleHierarchy: Record<string, number> = {
    "Super Admin": 1,
    Admin: 2,
    Support: 3,
  };

  const userLevel = roleHierarchy[normalized] || 999;
  const requiredLevel = roleHierarchy[normalizeRole(minimumRole)] || 999;

  return userLevel <= requiredLevel;
}
