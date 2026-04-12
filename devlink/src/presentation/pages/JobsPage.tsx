import { memo, useState } from "react";
import { useOwnUser } from "@/infrastructure/hooks/useOwnUser";
import { useGetMyCompanyJobs, useCreateJob, useUpdateJob, useDeleteJob, useGetAllJobs, useApplyToJob, useGetMyApplications, useGetJobApplications, useUpdateApplicationStatus } from "@/infrastructure/apis/api-management/jobs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, MapPin, DollarSign, Briefcase, CheckCircle, Users, ChevronDown, ChevronUp } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useCallback, useEffect } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

type JobFormModel = {
  title: string;
  description?: string;
  location?: string;
  salaryRange?: string;
  level?: string;
  type?: string;
  isRecruiterPosition?: boolean;
};

type ApplyFormModel = {
  coverLetter?: string;
  expectedSalary?: string;
};

const JOBS_PAGE_SIZE = 6;

export const JobsPage = memo(() => {
  const user = useOwnUser();
  const isCompanyMember = user?.role === "CompanyAdmin" || user?.role === "Recruiter";

  if (isCompanyMember) {
    return <CompanyJobsView />;
  }

  return <UserJobsView />;
});

const CompanyJobsView = () => {
  const { data: jobsData, isLoading } = useGetMyCompanyJobs();
  const jobs = jobsData?.response ?? [];
  const [editingJob, setEditingJob] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const user = useOwnUser();
  const isCompanyAdmin = user?.role === "CompanyAdmin";

  const filteredJobs = jobs.filter((job: { title?: string; description?: string; location?: string; salaryRange?: string; level?: string; type?: string }) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;

    return (
      job.title?.toLowerCase().includes(term) ||
      job.description?.toLowerCase().includes(term) ||
      job.location?.toLowerCase().includes(term) ||
      job.salaryRange?.toLowerCase().includes(term) ||
      job.level?.toLowerCase().includes(term) ||
      job.type?.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / JOBS_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedJobs = filteredJobs.slice((currentPage - 1) * JOBS_PAGE_SIZE, currentPage * JOBS_PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, jobs.length]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Jobs</h1>
          <p className="text-muted-foreground">Manage your company's job postings</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Post a Job
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Job</DialogTitle>
            </DialogHeader>
            <JobForm onSuccess={() => setIsCreateOpen(false)} isCompanyAdmin={isCompanyAdmin} />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p className="text-center text-muted-foreground">Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No job postings yet. Create your first one!</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Input
              placeholder="Search jobs by title, location, level, type..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="sm:max-w-md"
            />
            <p className="text-sm text-muted-foreground">{filteredJobs.length} matching jobs</p>
          </div>

          {filteredJobs.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No jobs match your search.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {paginatedJobs.map((job: { id: string; title: string; description?: string; location?: string; salaryRange?: string; level?: string; type?: string; isRecruiterPosition?: boolean }) => (
                <Card key={job.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{job.title}</CardTitle>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {job.location && (
                            <Badge variant="secondary" className="gap-1">
                              <MapPin className="h-3 w-3" />
                              {job.location}
                            </Badge>
                          )}
                          {job.salaryRange && (
                            <Badge variant="secondary" className="gap-1">
                              <DollarSign className="h-3 w-3" />
                              {job.salaryRange}
                            </Badge>
                          )}
                          {job.level && (
                            <Badge variant="outline" className="gap-1">
                              <Briefcase className="h-3 w-3" />
                              {job.level}
                            </Badge>
                          )}
                          {job.type && <Badge>{job.type}</Badge>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Dialog open={editingJob === job.id} onOpenChange={(open) => setEditingJob(open ? job.id : null)}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Job</DialogTitle>
                            </DialogHeader>
                            <JobForm job={job} isCompanyAdmin={isCompanyAdmin} onSuccess={() => setEditingJob(null)} />
                          </DialogContent>
                        </Dialog>
                        <DeleteJobButton id={job.id} />
                      </div>
                    </div>
                  </CardHeader>
                  {job.description && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{job.description}</p>
                    </CardContent>
                  )}
                  <div className="px-6 pb-4">
                    <Button variant="ghost" size="sm" className="gap-2" onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}>
                      <Users className="h-4 w-4" />
                      {expandedJob === job.id ? "Hide" : "View"} Applications
                      {expandedJob === job.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>
                  {expandedJob === job.id && <JobApplicationsView jobPostId={job.id} />}
                </Card>
              ))}
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
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
        </>
      )}
    </div>
  );
};

const UserJobsView = () => {
  const { data: jobsData, isLoading } = useGetAllJobs();
  const { data: applicationsData } = useGetMyApplications();
  const jobs = jobsData?.response ?? [];
  const applications = applicationsData?.response ?? [];
  const appliedJobIds = new Set(applications.map((a: { jobPostId: string }) => a.jobPostId));
  const [applyingJob, setApplyingJob] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const filteredJobs = jobs.filter((job: { title?: string; description?: string; location?: string; salaryRange?: string; level?: string; type?: string; company?: { name?: string } }) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;

    return (
      job.title?.toLowerCase().includes(term) ||
      job.description?.toLowerCase().includes(term) ||
      job.location?.toLowerCase().includes(term) ||
      job.salaryRange?.toLowerCase().includes(term) ||
      job.level?.toLowerCase().includes(term) ||
      job.type?.toLowerCase().includes(term) ||
      job.company?.name?.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / JOBS_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedJobs = filteredJobs.slice((currentPage - 1) * JOBS_PAGE_SIZE, currentPage * JOBS_PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, jobs.length]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Available Jobs</h1>
        <p className="text-muted-foreground">Browse and apply for open positions</p>
      </div>

      {isLoading ? (
        <p className="text-center text-muted-foreground">Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No job postings available.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Input
              placeholder="Search jobs by title, company, location, type..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="sm:max-w-md"
            />
            <p className="text-sm text-muted-foreground">{filteredJobs.length} matching jobs</p>
          </div>

          {filteredJobs.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No jobs match your search.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {paginatedJobs.map((job: { id: string; title: string; description?: string; location?: string; salaryRange?: string; level?: string; type?: string; isRecruiterPosition?: boolean; company?: { name: string } }) => {
            const hasApplied = appliedJobIds.has(job.id);

            return (
              <Card key={job.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{job.title}</CardTitle>
                      {job.company && <p className="text-sm text-muted-foreground">{job.company.name}</p>}
                      <div className="mt-2 flex flex-wrap gap-2">
                        {job.location && (
                          <Badge variant="secondary" className="gap-1">
                            <MapPin className="h-3 w-3" />
                            {job.location}
                          </Badge>
                        )}
                        {job.salaryRange && (
                          <Badge variant="secondary" className="gap-1">
                            <DollarSign className="h-3 w-3" />
                            {job.salaryRange}
                          </Badge>
                        )}
                        {job.level && (
                          <Badge variant="outline" className="gap-1">
                            <Briefcase className="h-3 w-3" />
                            {job.level}
                          </Badge>
                        )}
                        {job.type && <Badge>{job.type}</Badge>}
                        {job.isRecruiterPosition && <Badge variant="secondary">Recruiter</Badge>}
                      </div>
                    </div>
                    {hasApplied ? (
                      <Badge className="gap-1 bg-green-600">
                        <CheckCircle className="h-3 w-3" />
                        Applied
                      </Badge>
                    ) : (
                      <Dialog open={applyingJob === job.id} onOpenChange={(open) => setApplyingJob(open ? job.id : null)}>
                        <DialogTrigger asChild>
                          <Button>Apply Now</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Apply to {job.title}</DialogTitle>
                          </DialogHeader>
                          <ApplyForm jobId={job.id} onSuccess={() => setApplyingJob(null)} />
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </CardHeader>
                {job.description && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{job.description}</p>
                  </CardContent>
                )}
              </Card>
            );
              })}
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
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
        </>
      )}

      <div className="mt-8">
        <h2 className="mb-4 text-xl font-bold">My Applications</h2>
        {applications.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">You haven't applied to any jobs yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {applications.map((app: { id: string; jobPostId: string; status: string; coverLetter?: string; expectedSalary?: number }) => (
              <Card key={app.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {jobs.find((j: { id: string }) => j.id === app.jobPostId)?.title ?? "Unknown Job"}
                      </CardTitle>
                    </div>
                    <Badge variant={app.status === "Pending" ? "outline" : app.status === "Accepted" ? "default" : "destructive"}>
                      {app.status}
                    </Badge>
                  </div>
                </CardHeader>
                {app.coverLetter && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{app.coverLetter}</p>
                    {app.expectedSalary && <p className="mt-1 text-sm text-muted-foreground">Expected salary: ${app.expectedSalary.toLocaleString()}</p>}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const JobForm = ({ job, isCompanyAdmin, onSuccess }: { job?: { id: string; title: string; description?: string; location?: string; salaryRange?: string; level?: string; type?: string; isRecruiterPosition?: boolean }; isCompanyAdmin: boolean; onSuccess: () => void }) => {
  const createJob = useCreateJob();
  const updateJob = useUpdateJob();
  const queryClient = useQueryClient();
  const isEditing = !!job;

  const schema = yup.object().shape({
    title: yup.string().required("Title is required!").min(2, "Title must be at least 2 characters!"),
    description: yup.string(),
    location: yup.string(),
    salaryRange: yup.string(),
    level: yup.string(),
    type: yup.string(),
    isRecruiterPosition: yup.boolean(),
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<JobFormModel>({
    defaultValues: {
      title: job?.title || "",
      description: job?.description || "",
      location: job?.location || "",
      salaryRange: job?.salaryRange || "",
      level: job?.level || "",
      type: job?.type || "",
      isRecruiterPosition: job?.isRecruiterPosition || false,
    },
    resolver: yupResolver(schema),
  });

  const isRecruiterPosition = watch("isRecruiterPosition");

  useEffect(() => {
    if (job) {
      reset({
        title: job.title,
        description: job.description || "",
        location: job.location || "",
        salaryRange: job.salaryRange || "",
        level: job.level || "",
        type: job.type || "",
        isRecruiterPosition: job.isRecruiterPosition || false,
      });
    }
  }, [job, reset]);

  const submit = useCallback(
    (data: JobFormModel) => {
      const mutation = isEditing ? updateJob : createJob;
      const payload = isEditing ? { id: job!.id, ...data } : data;

      return mutation.mutateAsync(payload as Record<string, unknown>)
        .then(() => {
          toast.success(isEditing ? "Job updated!" : "Job created!");
          queryClient.invalidateQueries({ queryKey: ["myCompanyJobs"] });
          onSuccess();
        })
        .catch((error: unknown) => {
          toast.error((error as Error)?.message || "Failed!");
        });
    },
    [createJob, updateJob, isEditing, job, queryClient, onSuccess]
  );

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input id="title" {...register("title")} />
        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input id="description" {...register("description")} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" {...register("location")} placeholder="Remote, Bucharest, etc." />
        </div>
        <div className="space-y-2">
          <Label htmlFor="salaryRange">Salary Range</Label>
          <Input id="salaryRange" {...register("salaryRange")} placeholder="$50k-$80k" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="level">Level</Label>
          <Input id="level" {...register("level")} placeholder="Junior, Mid, Senior" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Input id="type" {...register("type")} placeholder="Full-time, Part-time, Contract" />
        </div>
      </div>
      {isCompanyAdmin && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isRecruiterPosition"
            {...register("isRecruiterPosition")}
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor="isRecruiterPosition" className="cursor-pointer">
            Recruiter Position (only company admins can create)
          </Label>
        </div>
      )}
      <div className="flex gap-2">
        <Button type="submit" disabled={createJob.status === "pending" || updateJob.status === "pending"}>
          {createJob.status === "pending" || updateJob.status === "pending" ? "Saving..." : isEditing ? "Update Job" : "Create Job"}
        </Button>
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

const ApplyForm = ({ jobId, onSuccess }: { jobId: string; onSuccess: () => void }) => {
  const applyToJob = useApplyToJob();
  const queryClient = useQueryClient();

  const schema = yup.object().shape({
    coverLetter: yup.string(),
    expectedSalary: yup.string(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplyFormModel>({
    defaultValues: {
      coverLetter: "",
      expectedSalary: "",
    },
    resolver: yupResolver(schema),
  });

  const submit = useCallback(
    (data: ApplyFormModel) => {
      return applyToJob.mutateAsync({ jobPostId: jobId, coverLetter: data.coverLetter, expectedSalary: data.expectedSalary ? parseFloat(data.expectedSalary) : undefined })
        .then(async () => {
          await Promise.all([
            queryClient.invalidateQueries({ queryKey: ["myApplications"] }),
            queryClient.invalidateQueries({ queryKey: ["allJobs"] }),
          ]);
          toast.success("Application submitted!");
          onSuccess();
        })
        .catch((error: unknown) => {
          toast.error((error as Error)?.message || "Failed to apply!");
        });
    },
    [applyToJob, jobId, onSuccess, queryClient]
  );

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="coverLetter">Cover Letter</Label>
        <Input id="coverLetter" {...register("coverLetter")} placeholder="Tell us why you're a great fit..." />
        {errors.coverLetter && <p className="text-sm text-destructive">{errors.coverLetter.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="expectedSalary">Expected Salary</Label>
        <Input id="expectedSalary" {...register("expectedSalary")} placeholder="$60,000" />
        {errors.expectedSalary && <p className="text-sm text-destructive">{errors.expectedSalary.message}</p>}
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={applyToJob.status === "pending"}>
          {applyToJob.status === "pending" ? "Submitting..." : "Submit Application"}
        </Button>
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

const DeleteJobButton = ({ id }: { id: string }) => {
  const deleteJob = useDeleteJob();
  const queryClient = useQueryClient();

  const handleDelete = () => {
    if (!window.confirm("Delete this job posting?")) {
      return;
    }

    deleteJob.mutate(id, {
      onSuccess: () => {
        toast.success("Job deleted!");
        queryClient.invalidateQueries({ queryKey: ["myCompanyJobs"] });
      },
      onError: (error: unknown) => {
        toast.error((error as Error)?.message || "Failed to delete job!");
      },
    });
  };

  return (
    <Button variant="destructive" size="icon" onClick={handleDelete} disabled={deleteJob.status === "pending"}>
      <Trash2 className="h-4 w-4" />
    </Button>
  );
};

const JobApplicationsView = ({ jobPostId }: { jobPostId: string }) => {
  const { data: applicationsData, isLoading } = useGetJobApplications(jobPostId);
  const applications = applicationsData?.response ?? [];
  const updateStatus = useUpdateApplicationStatus();
  const queryClient = useQueryClient();

  const handleStatusChange = (id: string, status: string) => {
    updateStatus.mutate(
      { id, status },
      {
        onSuccess: () => {
          toast.success("Application status updated!");
          queryClient.invalidateQueries({ queryKey: ["jobApplications", jobPostId] });
          queryClient.invalidateQueries({ queryKey: ["myCompanyJobs"] });
          queryClient.invalidateQueries({ queryKey: ["allJobs"] });
          queryClient.invalidateQueries({ queryKey: ["myApplications"] });
        },
        onError: (error: unknown) => {
          toast.error((error as Error)?.message || "Failed to update status!");
        },
      }
    );
  };

  if (isLoading) {
    return <p className="px-6 text-sm text-muted-foreground">Loading applications...</p>;
  }

  if (applications.length === 0) {
    return <p className="px-6 text-sm text-muted-foreground">No applications yet.</p>;
  }

  return (
    <div className="border-t px-6 pb-4 pt-4">
      <h3 className="mb-3 text-sm font-semibold">Applications ({applications.length})</h3>
      <div className="space-y-3">
        {applications.map((app: { id: string; userId: string; status: string; coverLetter?: string; expectedSalary?: number }) => (
          <Card key={app.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium">Applicant ID: {app.userId}</p>
                  {app.coverLetter && <p className="mt-1 text-sm text-muted-foreground">{app.coverLetter}</p>}
                  {app.expectedSalary && <p className="mt-1 text-sm text-muted-foreground">Expected salary: ${app.expectedSalary.toLocaleString()}</p>}
                </div>
                <div className="ml-4 flex items-center gap-2">
                  {app.status !== "Accepted" && app.status !== "Rejected" && (
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      className="rounded-md border bg-background px-2 py-1 text-sm"
                      disabled={updateStatus.status === "pending"}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Interview">Interview</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  )}
                  <Badge variant={app.status === "Pending" ? "outline" : app.status === "Accepted" ? "default" : app.status === "Interview" ? "secondary" : "destructive"}>
                    {app.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
