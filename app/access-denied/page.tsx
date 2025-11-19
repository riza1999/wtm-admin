import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function AccessDeniedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Access Denied</CardTitle>
          <CardDescription>
            You don&apos;t have permission to access this page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            If you believe this is an error, please contact your administrator
            to request the necessary permissions.
          </p>
          <div className="flex flex-col gap-2">
            <Button asChild>
              <Link href="/account/user-management/super-admin">
                Go to Dashboard
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/logout">Sign Out</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
