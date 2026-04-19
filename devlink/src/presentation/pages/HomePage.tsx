import { memo } from "react";
import { useAppSelector } from "@/application/store";
import { FeedPage } from "@/presentation/pages/FeedPage";
import { Briefcase, Users, Building } from "lucide-react";

export const HomePage = memo(() => {
  const { loggedIn } = useAppSelector((x) => x.profileReducer);

  if (loggedIn) {
    return <FeedPage />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <div className="max-w-3xl space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl text-primary">
            Welcome to DevLink
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 py-8">
          <div className="flex flex-col items-center space-y-2 p-6">
            <Users className="h-10 w-10 text-primary" />
            <h3 className="font-semibold text-lg">Connect</h3>
          </div>
          <div className="flex flex-col items-center space-y-2 p-6">
            <Briefcase className="h-10 w-10 text-primary" />
            <h3 className="font-semibold text-lg">Find Jobs</h3>
          </div>
          <div className="flex flex-col items-center space-y-2 p-6">
            <Building className="h-10 w-10 text-primary" />
            <h3 className="font-semibold text-lg">Companies</h3>
          </div>
        </div>
      </div>
    </div>
  );
});
