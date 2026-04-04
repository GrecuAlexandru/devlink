import { memo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const JobsPage = memo(() => {
  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>Jobs</CardTitle>
          <CardDescription>Browse job postings and opportunities</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Job listings will be displayed here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
});
