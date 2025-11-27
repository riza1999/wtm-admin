import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Access Denied</h1>
          <p className="mt-2 text-muted-foreground">
            You don't have permission to access this page
          </p>
        </div>

        <Alert variant="destructive">
          <ShieldAlert className="h-5 w-5" />
          <AlertTitle className="text-lg">Unauthorized Access</AlertTitle>
          <AlertDescription className="mt-2 text-base">
            You do not have the required permissions to view this page. This
            page is restricted to users with specific roles.
            <div className="mt-6 flex gap-4">
              <Button asChild>
                <Link href="/account/user-management/super-admin">
                  Return to Dashboard
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/logout">Logout</Link>
              </Button>
            </div>
          </AlertDescription>
        </Alert>

        <div className="rounded-lg border bg-muted/50 p-6">
          <h2 className="mb-2 font-semibold">Need Access?</h2>
          <p className="text-sm text-muted-foreground">
            If you believe you should have access to this page, please contact
            your system administrator to request the appropriate permissions.
          </p>
        </div>
      </div>
    </div>
  );
}
