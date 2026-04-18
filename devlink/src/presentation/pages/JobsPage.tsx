import { memo, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useOwnUser } from "@/infrastructure/hooks/useOwnUser";
import { useGetMyCompanyJobs, useCreateJob, useUpdateJob, useDeleteJob, useGetAllJobs, useApplyToJob, useGetMyApplications, useGetJobApplications, useUpdateApplicationStatus } from "@/infrastructure/apis/api-management/jobs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, MapPin, DollarSign, Briefcase, CheckCircle, Users, ChevronDown, ChevronUp, Building2, ExternalLink, FileText, UserRound } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useCallback, useEffect } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { AppRoute } from "@/routes";

type JobFormModel = {
  title: string;
  description?: string;
  location?: string;
  salary?: number;
  isRecruiterPosition?: boolean;
};

type ApplyFormModel = {
  coverLetter?: string;
  expectedSalary?: string;
};

const JOBS_PAGE_SIZE = 6;

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

  const filteredJobs = jobs.filter((job: { title?: string; description?: string; location?: string; salary?: number }) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;

    return (
      job.title?.toLowerCase().includes(term) ||
      job.description?.toLowerCase().includes(term) ||
      job.location?.toLowerCase().includes(term) ||
      job.salary?.toString().includes(term)
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
              placeholder="Search jobs by title, location, salary..."
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
              {paginatedJobs.map((job: { id: string; title: string; description?: string; location?: string; salary?: number; isRecruiterPosition?: boolean }) => (
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
                          {job.salary && (
                            <Badge variant="secondary" className="gap-1">
                              <DollarSign className="h-3 w-3" />
                              {job.salary}
                            </Badge>
                          )}
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
  const appliedJobIds = useMemo(() => new Set(applications.map((a: { jobPostId: string }) => a.jobPostId)), [applications]);
  const [applyingJob, setApplyingJob] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const jobsById = useMemo(() => {
    const map = new Map<string, any>();
    for (const job of jobs) {
      map.set(job.id, job);
    }
    return map;
  }, [jobs]);

  const filteredJobs = jobs.filter((job: {
    title?: string;
    description?: string;
    location?: string;
    salary?: number;
    company?: { id?: string; name?: string; description?: string; website?: string; industry?: string };
  }) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;

    return (
      job.title?.toLowerCase().includes(term) ||
      job.description?.toLowerCase().includes(term) ||
      job.location?.toLowerCase().includes(term) ||
      job.salary?.toString().includes(term) ||
      job.company?.name?.toLowerCase().includes(term) ||
      job.company?.industry?.toLowerCase().includes(term) ||
      job.company?.description?.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / JOBS_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedJobs = filteredJobs.slice((currentPage - 1) * JOBS_PAGE_SIZE, currentPage * JOBS_PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, jobs.length]);

  const statusVariant = (status: string): "outline" | "default" | "destructive" => {
    if (status === "InProgress") return "outline";
    if (status === "Accepted") return "default";
    return "destructive";
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Card className="mb-6 border-border/70 bg-card/90 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Find Your Next Role</CardTitle>
          <CardDescription>Browse roles with full context: company, responsibilities, and requirements.</CardDescription>
        </CardHeader>
      </Card>

      {isLoading ? (
        <p className="text-center text-muted-foreground">Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <Card className="border-border/70">
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
              className="sm:max-w-lg"
            />
            <p className="text-sm text-muted-foreground">{filteredJobs.length} matching jobs</p>
          </div>

          {filteredJobs.length === 0 ? (
            <Card className="border-border/70">
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No jobs match your search.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {paginatedJobs.map((job: {
                id: string;
                title: string;
                description?: string;
                location?: string;
                salary?: number;
                isRecruiterPosition?: boolean;
                company?: { id?: string; name?: string; description?: string; website?: string; industry?: string };
              }) => {
                const hasApplied = appliedJobIds.has(job.id);

                return (
                  <Card key={job.id} className="border-border/50 transition-all hover:shadow-md">
                    <CardContent className="pt-6 space-y-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <CardTitle className="text-2xl font-bold mb-1">{job.title}</CardTitle>
                          <div className="flex items-center flex-wrap gap-2 text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">
                              {job.company?.name ?? "Unknown company"}
                            </span>
                            {job.location && (
                              <>
                                <span> - </span>
                                <span>{job.location}</span>
                              </>
                            )}
                            {job.salary && (
                              <>
                                <span> - </span>
                                <span>${job.salary}</span>
                              </>
                            )}
                          </div>
                          
                          <div className="mt-4 flex flex-wrap gap-2">
                            {job.company?.industry && <Badge variant="secondary">{job.company.industry}</Badge>}
                            {job.isRecruiterPosition && <Badge variant="secondary">Recruiter Position</Badge>}
                          </div>
                        </div>

                        <div>
                          {hasApplied ? (
                            <Badge className="bg-green-600/10 text-green-700 border-0 px-3 py-1">
                              Applied
                            </Badge>
                          ) : (
                            <ApplyDirectButton jobId={job.id} onSuccess={() => setApplyingJob(null)} />
                          )}
                        </div>
                      </div>

                      {(job.description || job.company?.description) && <div className="h-px bg-border/40" />}

                      {job.description && (
                        <div>
                          <h3 className="font-semibold text-foreground mb-2">About the role</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{job.description}</p>
                        </div>
                      )}

                      {job.company?.id && (
                        <div className="pt-2">
                          <Link to={`${AppRoute.Company}/${job.company.id}`} className="text-sm font-medium text-primary hover:underline flex items-center gap-1 w-fit">
                            Open company page
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      )}
                    </CardContent>
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

      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-bold">My Applications</h2>
        {applications.length === 0 ? (
          <Card className="border-border/70">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">You haven't applied to any jobs yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {applications.map((app: { id: string; jobPostId: string; status: string }) => {
              const job = jobsById.get(app.jobPostId);
              return (
                <Card key={app.id} className="border-border/70 bg-card/90">
                  <CardHeader className="pb-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <CardTitle className="text-lg">{job?.title ?? "Unknown Job"}</CardTitle>
                        <CardDescription>{job?.company?.name ?? "Unknown company"}</CardDescription>
                      </div>
                      <Badge variant={statusVariant(app.status)}>{app.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                      {job?.location && <span>Location: {job.location}</span>}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const JobForm = ({ job, isCompanyAdmin, onSuccess }: { job?: { id: string; title: string; description?: string; location?: string; salary?: number; isRecruiterPosition?: boolean }; isCompanyAdmin: boolean; onSuccess: () => void }) => {
  const createJob = useCreateJob();
  const updateJob = useUpdateJob();
  const queryClient = useQueryClient();
  const isEditing = !!job;

  const schema = yup.object().shape({
    title: yup.string().required("Title is required!").min(2, "Title must be at least 2 characters!"),
    description: yup.string(),
    location: yup.string(),
    salary: yup.number().nullable().transform((value, originalValue) => (String(originalValue).trim() === "" ? null : value)),
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
      salary: job?.salary || undefined,
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
        salary: job.salary || undefined,
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
        <Textarea id="description" {...register("description")} placeholder="Describe responsibilities, requirements, and team context..." className="min-h-24" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" {...register("location")} placeholder="Remote, Bucharest, etc." />
        </div>
        <div className="space-y-2">
          <Label htmlFor="salary">Salary</Label>
          <Input id="salary" type="number" {...register("salary")} placeholder="60000" />
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

const ApplyDirectButton = ({ jobId, onSuccess }: { jobId: string; onSuccess: () => void }) => {
  const applyToJob = useApplyToJob();
  const queryClient = useQueryClient();

  const handleApply = useCallback(() => {
    applyToJob.mutateAsync({ jobPostId: jobId })
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
  }, [applyToJob, jobId, onSuccess, queryClient]);

  return (
    <Button onClick={handleApply} disabled={applyToJob.status === "pending"}>
      {applyToJob.status === "pending" ? "Applying..." : "Apply Directly"}
    </Button>
  );
};

const DeleteJobButton = ({ id }: { id: string }) => {
  const deleteJob = useDeleteJob();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    deleteJob.mutate(id, {
      onSuccess: () => {
        toast.success("Job deleted!");
        queryClient.invalidateQueries({ queryKey: ["myCompanyJobs"] });
        setOpen(false);
      },
      onError: (error: unknown) => {
        toast.error((error as Error)?.message || "Failed to delete job!");
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon" disabled={deleteJob.status === "pending"}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this job posting. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteJob.status === "pending"}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={deleteJob.status === "pending"}>
            {deleteJob.status === "pending" ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
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
        {applications.map((app: { id: string; userId: string; status: string; user?: { id: string; name: string; email: string } }) => {
          const applicantName = app.user?.name || `Applicant ${app.userId.slice(0, 8)}`;
          const applicantInitial = applicantName.charAt(0).toUpperCase();

          return (
            <Card key={app.id} className="border-border/70 bg-card/90">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-1 items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">{applicantInitial}</AvatarFallback>
                    </Avatar>

                    <div className="space-y-1">
                      <Link to={`${AppRoute.Profile}/${app.userId}`} className="inline-flex items-center gap-1 text-sm font-medium hover:underline">
                        {applicantName}
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                      <p className="text-xs text-muted-foreground">{app.user?.email || "No public email"}</p>
                    </div>
                  </div>

                  <div className="ml-2 flex items-center gap-2">
                    {app.status === "InProgress" || app.status === "Pending" || app.status === "Interview" ? (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="default"
                          className="bg-green-600 hover:bg-green-700 h-8"
                          onClick={() => handleStatusChange(app.id, "Accepted")}
                          disabled={updateStatus.status === "pending"}
                        >
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          className="h-8"
                          onClick={() => handleStatusChange(app.id, "Rejected")}
                          disabled={updateStatus.status === "pending"}
                        >
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <Badge variant={app.status === "Accepted" ? "default" : "destructive"}>
                        {app.status}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
