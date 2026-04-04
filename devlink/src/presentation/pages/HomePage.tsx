import { memo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const HomePage = memo(() => {
  return (
    <div className="flex items-center justify-center p-8">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to DevLink</CardTitle>
          <CardDescription>A LinkedIn clone for developers</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            DevLink is a professional networking platform designed specifically for developers.
            Connect with other programmers, showcase your portfolio projects, and discover
            job opportunities in the tech industry.
          </p>
        </CardContent>
      </Card>
    </div>
  );
});
