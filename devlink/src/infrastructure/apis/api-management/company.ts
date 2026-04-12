import { useQuery, useMutation } from "@tanstack/react-query";

const basePath = import.meta.env.VITE_APP_API_BASE_URL || "http://localhost:5000";

export const useCreateCompany = () => {
  return useMutation({
    mutationFn: async (data: { name: string; industry: string; website?: string; description?: string }) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${basePath}/api/Company/Add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.errorMessage?.message || "Failed to create company");
      }

      return response.json();
    },
  });
};

export const useGetMyCompany = () => {
  return useQuery({
    queryKey: ["myCompany"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${basePath}/api/Company/GetMyCompany`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch company");
      }

      return response.json();
    },
  });
};

export const useUpdateCompany = () => {
  return useMutation({
    mutationFn: async (data: { id: string; name?: string; industry?: string; website?: string; description?: string }) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${basePath}/api/Company/Update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.errorMessage?.message || "Failed to update company");
      }

      return response.json();
    },
  });
};

export const useGetCompanyMembers = () => {
  return useQuery({
    queryKey: ["companyMembers"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${basePath}/api/CompanyMember/GetMembers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch members");
      }

      return response.json();
    },
  });
};

export const useGetCompanyById = (id: string) => {
  return useQuery({
    queryKey: ["company", id],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${basePath}/api/Company/GetById/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch company");
      }

      return response.json();
    },
    enabled: !!id,
  });
};

export const useGetCompanyMembersById = (companyId: string) => {
  return useQuery({
    queryKey: ["companyMembers", companyId],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${basePath}/api/CompanyMember/GetMembersById/${companyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch members");
      }

      return response.json();
    },
    enabled: !!companyId,
  });
};

export const useAddCompanyMember = () => {
  return useMutation({
    mutationFn: async (data: { userId: string; role: string }) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${basePath}/api/CompanyMember/AddMember`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.errorMessage?.message || "Failed to add member");
      }

      return response.json();
    },
  });
};

export const useRemoveCompanyMember = () => {
  return useMutation({
    mutationFn: async (userId: string) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${basePath}/api/CompanyMember/RemoveMember/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.errorMessage?.message || "Failed to remove member");
      }

      return response.json();
    },
  });
};

export const useUpdateMemberRole = () => {
  return useMutation({
    mutationFn: async (data: { userId: string; role: string }) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${basePath}/api/CompanyMember/UpdateMemberRole`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.errorMessage?.message || "Failed to update member role");
      }

      return response.json();
    },
  });
};
