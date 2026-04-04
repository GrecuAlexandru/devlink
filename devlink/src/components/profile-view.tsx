import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProfileFormController } from "@/presentation/components/forms/ProfileView/ProfileForm.controller";

export function ProfileView({ className }: React.ComponentProps<"div">) {
  const { state, actions, computed } = useProfileFormController();

  if (state.isLoading) {
    return (
      <div className={cn("flex flex-col gap-6", className)}>
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Loading profile...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={actions.handleSubmit(actions.submit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                {...actions.register("name")}
                disabled={computed.isSubmitting}
              />
              {state.errors.name && <p className="text-sm text-destructive">{state.errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Input
                id="bio"
                type="text"
                placeholder="Tell us about yourself"
                {...actions.register("bio")}
                disabled={computed.isSubmitting}
              />
              {state.errors.bio && <p className="text-sm text-destructive">{state.errors.bio.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="profilePictureUrl">Profile Picture URL</Label>
              <Input
                id="profilePictureUrl"
                type="url"
                placeholder="https://example.com/photo.jpg"
                {...actions.register("profilePictureUrl")}
                disabled={computed.isSubmitting}
              />
              {state.errors.profilePictureUrl && <p className="text-sm text-destructive">{state.errors.profilePictureUrl.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedInUrl">LinkedIn URL</Label>
              <Input
                id="linkedInUrl"
                type="url"
                placeholder="https://linkedin.com/in/username"
                {...actions.register("linkedInUrl")}
                disabled={computed.isSubmitting}
              />
              {state.errors.linkedInUrl && <p className="text-sm text-destructive">{state.errors.linkedInUrl.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="gitHubUrl">GitHub URL</Label>
              <Input
                id="gitHubUrl"
                type="url"
                placeholder="https://github.com/username"
                {...actions.register("gitHubUrl")}
                disabled={computed.isSubmitting}
              />
              {state.errors.gitHubUrl && <p className="text-sm text-destructive">{state.errors.gitHubUrl.message}</p>}
            </div>
            <Button type="submit" disabled={computed.isSubmitting} className="w-full">
              {computed.isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
