import { memo } from "react";
import { RegisterForm } from "@/components/register-form";

export const RegisterPage = memo(() => {
  return (
    <div className="flex min-h-[calc(100vh-100px)] items-center justify-center p-8">
      <RegisterForm />
    </div>
  );
});
