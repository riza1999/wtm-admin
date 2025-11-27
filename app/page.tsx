import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

/**
 * Get the redirect path based on user role
 * This matches the logic in middleware.ts
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

export default async function Home() {
  const session = await getServerSession(authOptions);
  const userRole = session?.user?.role;
  const redirectPath = getRoleBasedRedirectPath(userRole);

  redirect(redirectPath);
  return <></>;
}
