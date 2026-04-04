import { memo } from "react";
import { Navigate } from "react-router-dom";
import { LoginForm } from "@/components/login-form";
import { useAppSelector } from "@/application/store";
import { AppRoute } from "@/routes";

export const LoginPage = memo(() => {
  const { loggedIn } = useAppSelector((x) => x.profileReducer);

  if (loggedIn) {
    return <Navigate to={AppRoute.Index} replace />;
  }

  return (
    <div className="flex min-h-[calc(100vh-100px)] items-center justify-center p-8">
      <LoginForm />
    </div>
  );
});
