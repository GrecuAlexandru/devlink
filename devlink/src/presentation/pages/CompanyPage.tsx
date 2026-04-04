import { memo } from "react";
import { CompanyView } from "@/components/company-view";

export const CompanyPage = memo(() => {
  return (
    <div className="flex min-h-[calc(100vh-100px)] items-center justify-center p-8">
      <CompanyView />
    </div>
  );
});
