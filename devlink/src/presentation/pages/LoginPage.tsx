import { memo } from "react";
import { LoginForm } from "@/components/login-form";

export const LoginPage = memo(() => {
  return (
    <div className="flex min-h-[calc(100vh-100px)] items-center justify-center p-8">
      <LoginForm />
    </div>
  );
});
