import { memo } from "react";
import { useParams } from "react-router-dom";
import { useOwnUser } from "@/infrastructure/hooks/useOwnUser";
import { useGetMyProfile, useGetUserProfile } from "@/infrastructure/apis/api-management/profile";
import { useProfileFormController } from "@/presentation/components/forms/ProfileView/ProfileForm.controller";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Link as LinkIcon, Building2 } from "lucide-react";

export const ProfilePage = memo(() => {
  const { id } = useParams<{ id: string }>();
  const ownUser = useOwnUser();
  const isOwnProfile = !id || id === ownUser?.id;

  if (isOwnProfile) {
    return <OwnProfileView />;
  }

  return <OtherProfileView userId={id!} />;
});

const OwnProfileView = () => {
  const { state, actions, computed } = useProfileFormController();
  const user = useOwnUser();
  const isCompanyOwner = user?.role === "CompanyAdmin";
  const isRecruiter = user?.role === "Recruiter";

  if (state.isLoading) {
    return <p className="text-center text-muted-foreground">Loading profile...</p>;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Card className="overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600" />
        <CardContent className="relative px-6 pb-6">
          <div className="-mt-12 mb-4 flex items-end gap-4">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-background text-3xl font-semibold text-primary shadow-sm">
              {user?.name?.charAt(0).toUpperCase() ?? "U"}
            </div>
            <div className="mb-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{user?.name}</h1>
                {isCompanyOwner && (
                  <Badge className="gap-1 bg-emerald-600">
                    <Building2 className="h-3 w-3" />
                    Company Owner
                  </Badge>
                )}
                {isRecruiter && (
                  <Badge variant="secondary" className="gap-1">
                    <Building2 className="h-3 w-3" />
                    Recruiter
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={actions.handleSubmit(actions.submit)} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...actions.register("name")} disabled={computed.isSubmitting} />
                {state.errors.name && <p className="text-sm text-destructive">{state.errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Headline / Bio</Label>
                <Input id="bio" {...actions.register("bio")} disabled={computed.isSubmitting} placeholder="Software Developer at..." />
                {state.errors.bio && <p className="text-sm text-destructive">{state.errors.bio.message}</p>}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="linkedInUrl">LinkedIn URL</Label>
                <Input id="linkedInUrl" {...actions.register("linkedInUrl")} disabled={computed.isSubmitting} placeholder="https://linkedin.com/in/..." />
                {state.errors.linkedInUrl && <p className="text-sm text-destructive">{state.errors.linkedInUrl.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="gitHubUrl">GitHub URL</Label>
                <Input id="gitHubUrl" {...actions.register("gitHubUrl")} disabled={computed.isSubmitting} placeholder="https://github.com/..." />
                {state.errors.gitHubUrl && <p className="text-sm text-destructive">{state.errors.gitHubUrl.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profilePictureUrl">
                <LinkIcon className="mr-1 inline h-4 w-4" />
                Profile Picture URL
              </Label>
              <Input id="profilePictureUrl" {...actions.register("profilePictureUrl")} disabled={computed.isSubmitting} placeholder="https://example.com/photo.jpg" />
              {state.errors.profilePictureUrl && <p className="text-sm text-destructive">{state.errors.profilePictureUrl.message}</p>}
            </div>

            <Button type="submit" disabled={computed.isSubmitting}>
              {computed.isSubmitting ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const OtherProfileView = ({ userId }: { userId: string }) => {
  const { data: profileData, isLoading } = useGetUserProfile(userId);
  const profile = profileData?.response;

  if (isLoading) {
    return <p className="text-center text-muted-foreground">Loading profile...</p>;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Card className="overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600" />
        <CardContent className="relative px-6 pb-6">
          <div className="-mt-12 mb-4 flex items-end gap-4">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-background text-3xl font-semibold text-primary shadow-sm">
              {profile?.userId?.charAt(0).toUpperCase() ?? "U"}
            </div>
            <div className="mb-1">
              <h1 className="text-2xl font-bold">{profile?.userId}</h1>
              {profile?.bio && <p className="text-muted-foreground">{profile.bio}</p>}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {profile?.linkedInUrl && (
              <a href={profile.linkedInUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline">
                LinkedIn Profile
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
            {profile?.gitHubUrl && (
              <a href={profile.gitHubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-800 hover:underline">
                GitHub Profile
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
