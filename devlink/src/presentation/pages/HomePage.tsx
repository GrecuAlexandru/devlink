import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BriefcaseBusiness, Code2, Users } from "lucide-react";

export const HomePage = memo(() => {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <Card className="border-border/70 shadow-sm">
        <CardHeader className="space-y-3">
          <Badge variant="secondary" className="w-fit">Developer Network</Badge>
          <CardTitle className="text-3xl tracking-tight">Welcome to DevLink</CardTitle>
          <CardDescription className="max-w-2xl">
            A professional networking space for developers, recruiters, and teams.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="max-w-3xl text-muted-foreground">
            DevLink is a professional networking platform designed specifically for developers.
            Connect with other programmers, showcase your portfolio projects, and discover
            job opportunities in the tech industry.
          </p>

          <Separator />

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-border/70 bg-background/70">
              <CardHeader className="pb-2">
                <Code2 className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">Showcase Work</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Publish posts, share code, and keep your profile up to date.</p>
              </CardContent>
            </Card>

            <Card className="border-border/70 bg-background/70">
              <CardHeader className="pb-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">Build Connections</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Discover developers and grow your professional network.</p>
              </CardContent>
            </Card>

            <Card className="border-border/70 bg-background/70">
              <CardHeader className="pb-2">
                <BriefcaseBusiness className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">Find Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Apply to roles and track application progress from one place.</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});
