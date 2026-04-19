import { memo, useMemo, useState } from "react";
import { useGetFeedbackList, useSubmitFeedback, type FeedbackQuality } from "@/infrastructure/apis/api-management/feedback";
import { useOwnUser } from "@/infrastructure/hooks/useOwnUser";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";

const ADMIN_PAGE_SIZE = 8;

export const FeedbackPage = memo(() => {
  const user = useOwnUser();
  const isAdmin = user?.role === "Admin" || user?.email === "admin@default.com";

  const submitFeedback = useSubmitFeedback();
  const { data: feedbackData, isLoading: isFeedbackLoading } = useGetFeedbackList(!!isAdmin);

  const [quality, setQuality] = useState<FeedbackQuality>("Average");
  const [wouldRecommend, setWouldRecommend] = useState(true);
  const [allowContact, setAllowContact] = useState(false);
  const [message, setMessage] = useState("");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const feedbackEntries = feedbackData?.response ?? [];

  const filteredFeedback = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      return feedbackEntries;
    }

    return feedbackEntries.filter((entry: any) =>
      (entry?.message ?? "").toLowerCase().includes(term) ||
      (entry?.quality ?? "").toLowerCase().includes(term) ||
      (entry?.user?.name ?? "").toLowerCase().includes(term) ||
      (entry?.user?.email ?? "").toLowerCase().includes(term)
    );
  }, [feedbackEntries, search]);

  const totalPages = Math.max(1, Math.ceil(filteredFeedback.length / ADMIN_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedFeedback = filteredFeedback.slice(
    (currentPage - 1) * ADMIN_PAGE_SIZE,
    currentPage * ADMIN_PAGE_SIZE
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!message.trim()) {
      toast.error("Please write your feedback message.");
      return;
    }

    submitFeedback.mutate(
      {
        quality,
        wouldRecommend,
        allowContact,
        message: message.trim(),
      },
      {
        onSuccess: () => {
          toast.success("Thank you! Your feedback was submitted.");
          setQuality("Average");
          setWouldRecommend(true);
          setAllowContact(false);
          setMessage("");
        },
        onError: (error: unknown) => {
          toast.error((error as Error)?.message || "Failed to submit feedback.");
        },
      }
    );
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-8">
      {!isAdmin && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Feedback</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>What do you think of the jobs here?</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={quality}
                  onChange={(event) => setQuality(event.target.value as FeedbackQuality)}
                >
                  <option value="Poor">Poor</option>
                  <option value="Average">Average</option>
                  <option value="Excellent">Excellent</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Would you recommend us to other devs?</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="recommend"
                      checked={wouldRecommend}
                      onChange={() => setWouldRecommend(true)}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="recommend"
                      checked={!wouldRecommend}
                      onChange={() => setWouldRecommend(false)}
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="contact"
                  checked={allowContact}
                  onChange={(event) => setAllowContact(event.target.checked)}
                />
                <Label htmlFor="contact">Did you get a job using our website?</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="suggestions">What should we add next?</Label>
                <textarea
                  id="suggestions"
                  className="flex min-h-25 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Your suggestions..."
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                />
              </div>

              <Button type="submit" className="w-full" disabled={submitFeedback.isPending}>
                {submitFeedback.isPending ? "Submitting..." : "Submit Feedback"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {isAdmin && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Feedback Inbox</CardTitle>
            <CardDescription>Visible only for admin users.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search by user, email, quality, or text..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
              />
            </div>

            {isFeedbackLoading ? (
              <p className="text-sm text-muted-foreground">Loading feedback...</p>
            ) : paginatedFeedback.length === 0 ? (
              <p className="text-sm text-muted-foreground">No feedback entries found.</p>
            ) : (
              <div className="space-y-3">
                {paginatedFeedback.map((entry: any) => (
                  <Card key={entry.id}>
                    <CardContent className="space-y-2 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="font-medium">{entry.user?.name ?? "Unknown user"}</p>
                          <p className="text-xs text-muted-foreground">{entry.user?.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{entry.quality}</Badge>
                          <Badge variant={entry.wouldRecommend ? "default" : "outline"}>
                            {entry.wouldRecommend ? "Recommends" : "Does not recommend"}
                          </Badge>
                          {entry.allowContact && <Badge variant="outline">Can contact</Badge>}
                        </div>
                      </div>
                      <p className="text-sm">{entry.message}</p>
                      <p className="text-xs text-muted-foreground">{new Date(entry.createdAt).toLocaleString()}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-muted-foreground">
                Page {currentPage} / {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage <= 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage >= totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
});
