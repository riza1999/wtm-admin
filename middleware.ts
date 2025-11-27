import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/forgot-password", "/reset-password"];

/**
 * Get the redirect path based on user role
 */
function getRoleBasedRedirectPath(role: string | undefined): string {
  if (!role) return "/account/agent-overview/agent-control";

  switch (role) {
    case "Super Admin":
      return "/account/user-management/super-admin";
    case "Admin":
      return "/account/user-management/support";
    case "Support":
      return "/account/agent-overview/agent-control";
    default:
      return "/account/agent-overview/agent-control";
  }
}

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuthenticated = Boolean(token);
    const { pathname } = req.nextUrl;

    const isPublicPath = PUBLIC_PATHS.includes(pathname);

    if (!isAuthenticated && !isPublicPath) {
      const callbackUrl = `${pathname}${req.nextUrl.search}`;
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", callbackUrl);
      return NextResponse.redirect(loginUrl);
    }

    if (isAuthenticated && pathname === "/login") {
      const userRole = token?.user?.role as string | undefined;
      const redirectPath = getRoleBasedRedirectPath(userRole);
      return NextResponse.redirect(new URL(redirectPath, req.url));
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
