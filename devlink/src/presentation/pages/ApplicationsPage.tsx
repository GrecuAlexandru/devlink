import { memo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const ApplicationsPage = memo(() => {
  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>My Applications</CardTitle>
          <CardDescription>Track your job applications and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Application tracking will be displayed here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
});
