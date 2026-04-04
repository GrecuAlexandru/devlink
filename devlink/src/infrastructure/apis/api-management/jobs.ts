import { useQuery, useMutation } from "@tanstack/react-query";

const basePath = import.meta.env.VITE_APP_API_BASE_URL || "http://localhost:5000";

export const useGetMyCompanyJobs = () => {
  return useQuery({
    queryKey: ["myCompanyJobs"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${basePath}/api/JobPost/GetMyCompanyJobs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      return response.json();
    },
  });
};

export const useGetAllJobs = () => {
  return useQuery({
    queryKey: ["allJobs"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${basePath}/api/JobPost/GetAll/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      return response.json();
    },
  });
};

export const useCreateJob = () => {
  return useMutation({
    mutationFn: async (data: { title: string; description?: string; location?: string; salaryRange?: string; level?: string; type?: string }) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${basePath}/api/JobPost/Add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.errorMessage?.message || "Failed to create job");
      }

      return response.json();
    },
  });
};

export const useUpdateJob = () => {
  return useMutation({
    mutationFn: async (data: { id: string; title?: string; description?: string; location?: string; salaryRange?: string; level?: string; type?: string }) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${basePath}/api/JobPost/Update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.errorMessage?.message || "Failed to update job");
      }

      return response.json();
    },
  });
};

export const useDeleteJob = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${basePath}/api/JobPost/Delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.errorMessage?.message || "Failed to delete job");
      }

      return response.json();
    },
  });
};

export const useApplyToJob = () => {
  return useMutation({
    mutationFn: async (data: { jobPostId: string; coverLetter?: string; expectedSalary?: number }) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${basePath}/api/Application/Apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.errorMessage?.message || "Failed to apply");
      }

      return response.json();
    },
  });
};

export const useGetMyApplications = () => {
  return useQuery({
    queryKey: ["myApplications"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${basePath}/api/Application/GetMyApplications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch applications");
      }

      return response.json();
    },
  });
};

export const useGetJobApplications = (jobPostId: string) => {
  return useQuery({
    queryKey: ["jobApplications", jobPostId],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${basePath}/api/Application/GetJobApplications/${jobPostId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch applications");
      }

      return response.json();
    },
    enabled: !!jobPostId,
  });
};

export const useUpdateApplicationStatus = () => {
  return useMutation({
    mutationFn: async (data: { id: string; status: string }) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${basePath}/api/Application/UpdateStatus`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.errorMessage?.message || "Failed to update application");
      }

      return response.json();
    },
  });
};
