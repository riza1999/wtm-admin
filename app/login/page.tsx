import { LoginForm } from "@/components/login/login-form";

type LoginPageProps = {
  searchParams: {
    callbackUrl?: string;
  };
};

export default function Page({ searchParams }: LoginPageProps) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm callbackUrl={searchParams?.callbackUrl} />
      </div>
    </div>
  );
}
