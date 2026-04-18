import { memo } from "react";
import { useParams } from "react-router-dom";
import { useOwnUser } from "@/infrastructure/hooks/useOwnUser";
import { useGetUserProfile } from "@/infrastructure/apis/api-management/profile";
import { useGetUser } from "@/infrastructure/apis/api-management/user";
import { useProfileFormController } from "@/presentation/components/forms/ProfileView/ProfileForm.controller";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Building2, ExternalLink } from "lucide-react";

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
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <Card>
          <CardContent className="space-y-3 p-6">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <Card className="overflow-hidden border-border/70 bg-card/90 shadow-sm">
        <CardContent className="flex flex-col gap-4 px-6 pb-6 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24 bg-muted shadow-sm">
              <AvatarFallback className="text-xl font-semibold text-primary">
                {user?.name?.charAt(0).toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">{user?.name}</h1>
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
                {!isCompanyOwner && !isRecruiter && <Badge variant="outline">Developer</Badge>}
              </div>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>

        </CardContent>
      </Card>

      <Card className="border-border/70 bg-card/90">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>Update your public information and social links.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={actions.handleSubmit(actions.submit)} className="space-y-6">
            <Tabs defaultValue="about" className="space-y-4">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="links">Links</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" {...actions.register("name")} disabled={computed.isSubmitting} />
                    {state.errors.name && <p className="text-sm text-destructive">{state.errors.name.message}</p>}
                  </div>
                </div>

              </TabsContent>

              <TabsContent value="links" className="space-y-4">
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

              </TabsContent>
            </Tabs>

            <Separator />

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
  const { data: profileData, isLoading: isLoadingProfile } = useGetUserProfile(userId);
  const { data: userData, isLoading: isLoadingUser } = useGetUser(userId);
  const profile = profileData?.response;
  const user = userData?.response;

  const displayName = user?.name || (profile?.userId ? `Member ${profile.userId.slice(0, 8)}` : "Developer");
  const profileInitial = displayName.charAt(0).toUpperCase();

  if (isLoadingProfile || isLoadingUser) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <Card>
          <CardContent className="space-y-3 p-6">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <Card className="overflow-hidden border-border/70 bg-card/90 shadow-sm">
        <CardContent className="flex flex-col gap-4 px-6 pb-6 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24 bg-muted shadow-sm">
              <AvatarFallback className="text-xl font-semibold text-primary">{profileInitial}</AvatarFallback>
            </Avatar>

            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight">{displayName}</h1>
              <p className="text-sm text-muted-foreground">DevLink member</p>
            </div>
          </div>

          <Badge variant="outline">Public Profile</Badge>
        </CardContent>
      </Card>

      <Card className="border-border/70 bg-card/90">
        <CardHeader>
          <CardTitle>About</CardTitle>
          <CardDescription>Professional links and profile summary.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">No additional details available.</p>
          <Separator />

          <div className="flex flex-wrap gap-3">
            {profile?.linkedInUrl && (
              <a href={profile.linkedInUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm transition-colors hover:bg-muted">
                LinkedIn
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
            {profile?.gitHubUrl && (
              <a href={profile.gitHubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm transition-colors hover:bg-muted">
                GitHub
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
