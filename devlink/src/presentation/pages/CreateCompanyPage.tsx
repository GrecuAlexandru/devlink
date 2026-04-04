import { memo } from "react";
import { CreateCompanyForm } from "@/components/create-company-form";

export const CreateCompanyPage = memo(() => {
  return (
    <div className="flex min-h-[calc(100vh-100px)] items-center justify-center p-8">
      <CreateCompanyForm />
    </div>
  );
});
