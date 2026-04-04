import { memo } from "react";
import { ProfileView } from "@/components/profile-view";

export const ProfilePage = memo(() => {
  return (
    <div className="flex min-h-[calc(100vh-100px)] items-center justify-center p-8">
      <ProfileView />
    </div>
  );
});
