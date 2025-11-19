import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { Permission } from "@/types/permissions";
import { ROUTE_PERMISSIONS } from "@/types/permissions";

const PUBLIC_PATHS = ["/login"];
const AUTHENTICATED_REDIRECT_PATH = "/account/user-management/super-admin";
const ACCESS_DENIED_PATH = "/access-denied";

/**
 * Check if user has required permission for a route
 */
function hasRoutePermission(
  userPermissions: string[] | undefined,
  pathname: string
): boolean {
  // Find matching route pattern
  const requiredPermissions = Object.entries(ROUTE_PERMISSIONS).find(
    ([pattern]) => {
      // Convert route pattern to regex (simple implementation)
      const regexPattern = pattern
        .replace(/\[.*?\]/g, "[^/]+") // Replace [id] with regex
        .replace(/\//g, "\\/"); // Escape slashes
      const regex = new RegExp(`^${regexPattern}$`);
      return regex.test(pathname);
    }
  )?.[1];

  // If no permissions required for this route, allow access
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true;
  }

  // Check if user has at least one required permission
  if (!userPermissions || userPermissions.length === 0) {
    return false;
  }

  return requiredPermissions.some((permission) =>
    userPermissions.includes(permission)
  );
}

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuthenticated = Boolean(token);
    const { pathname } = req.nextUrl;

    const isPublicPath = PUBLIC_PATHS.includes(pathname);

    // Handle unauthenticated users
    if (!isAuthenticated && !isPublicPath) {
      const callbackUrl = `${pathname}${req.nextUrl.search}`;
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", callbackUrl);
      return NextResponse.redirect(loginUrl);
    }

    // Redirect authenticated users away from login page
    if (isAuthenticated && pathname === "/login") {
      return NextResponse.redirect(
        new URL(AUTHENTICATED_REDIRECT_PATH, req.url)
      );
    }

    // Check route permissions for authenticated users
    if (isAuthenticated && !isPublicPath) {
      const userPermissions = (token.user as { permissions?: Permission[] })
        ?.permissions;

      if (!hasRoutePermission(userPermissions, pathname)) {
        // Redirect to access denied page
        return NextResponse.redirect(new URL(ACCESS_DENIED_PATH, req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
