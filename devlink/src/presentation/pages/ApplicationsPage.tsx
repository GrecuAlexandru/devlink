import { memo, useMemo, useState } from "react";
import { useGetAllJobs, useGetMyApplications } from "@/infrastructure/apis/api-management/jobs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const APPLICATIONS_PAGE_SIZE = 8;

export const ApplicationsPage = memo(() => {
  const { data: applicationsData, isLoading: applicationsLoading } = useGetMyApplications();
  const { data: jobsData, isLoading: jobsLoading } = useGetAllJobs();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const applications = applicationsData?.response ?? [];
  const jobs = jobsData?.response ?? [];

  const jobsById = useMemo(() => {
    const map = new Map<string, any>();
    for (const job of jobs) {
      map.set(job.id, job);
    }
    return map;
  }, [jobs]);

  const normalizedApplications = useMemo(() => {
    return applications.map((application: any) => {
      const job = jobsById.get(application.jobPostId);
      return {
        ...application,
        jobTitle: job?.title ?? "Unknown Job",
        location: job?.location ?? "N/A",
        type: job?.type ?? "N/A",
      };
    });
  }, [applications, jobsById]);

  const filteredApplications = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      return normalizedApplications;
    }

    return normalizedApplications.filter((application: any) =>
      application.jobTitle.toLowerCase().includes(term) ||
      application.status.toLowerCase().includes(term) ||
      application.location.toLowerCase().includes(term) ||
      application.type.toLowerCase().includes(term)
    );
  }, [normalizedApplications, search]);

  const totalPages = Math.max(1, Math.ceil(filteredApplications.length / APPLICATIONS_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * APPLICATIONS_PAGE_SIZE,
    currentPage * APPLICATIONS_PAGE_SIZE
  );

  const isLoading = applicationsLoading || jobsLoading;

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-8">
      <Card>
        <CardHeader>
          <CardTitle>My Applications</CardTitle>
          <CardDescription>Track your job applications with search and pagination.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Input
              placeholder="Search by job title, status, location, type..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              className="sm:max-w-md"
            />
            <p className="text-sm text-muted-foreground">{filteredApplications.length} matching applications</p>
          </div>

          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading applications...</p>
          ) : paginatedApplications.length === 0 ? (
            <p className="text-sm text-muted-foreground">No applications found.</p>
          ) : (
            <div className="space-y-3">
              {paginatedApplications.map((application: any) => (
                <Card key={application.id}>
                  <CardContent className="space-y-2 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-medium">{application.jobTitle}</p>
                      <Badge
                        variant={
                          application.status === "InProgress"
                            ? "outline"
                            : application.status === "Accepted"
                              ? "default"
                              : "destructive"
                        }
                      >
                        {application.status}
                      </Badge>
                    </div>
                    <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                      <p>Location: {application.location}</p>
                      <p>Type: {application.type}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <p className="text-sm text-muted-foreground">Page {currentPage} / {totalPages}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={currentPage <= 1}>
                Previous
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))} disabled={currentPage >= totalPages}>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});
