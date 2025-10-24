import { LoginForm } from "@/components/login/login-form";

type LoginPageProps = {
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
};

export default async function Page({ searchParams }: LoginPageProps) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm callbackUrl={callbackUrl} />
      </div>
    </div>
  );
}
