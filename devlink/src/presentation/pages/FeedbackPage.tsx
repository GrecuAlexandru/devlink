import { memo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const FeedbackPage = memo(() => {
  return (
    <div className="flex justify-center p-8">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Feedback</CardTitle>
          <CardDescription>
            Help us improve DevLink by sharing your thoughts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>How would you rate the quality of jobs posted on DevLink?</Label>
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="poor">Poor</option>
              <option value="average">Average</option>
              <option value="excellent">Excellent</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Would you recommend this platform to other developers?</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="radio" name="recommend" value="yes" />
                <span>Yes</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="recommend" value="no" />
                <span>No</span>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="contact" />
            <Label htmlFor="contact">
              I agree to be contacted by the technical team for UI/UX improvements
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="suggestions">Describe a feature you would like us to add</Label>
            <textarea
              id="suggestions"
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Your suggestions..."
            />
          </div>

          <Button type="submit" className="w-full">
            Submit Feedback
          </Button>
        </CardContent>
      </Card>
    </div>
  );
});
