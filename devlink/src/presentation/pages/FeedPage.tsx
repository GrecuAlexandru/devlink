import { memo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const FeedPage = memo(() => {
  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>Feed</CardTitle>
          <CardDescription>
            Your personalized feed of skill endorsements and networking updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Feed content will be displayed here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
});
