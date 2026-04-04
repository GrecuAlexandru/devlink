import { useQuery, useMutation } from "@tanstack/react-query";

const basePath = import.meta.env.VITE_APP_API_BASE_URL || "http://localhost:5000";

export const useGetMyProfile = () => {
  return useQuery({
    queryKey: ["myProfile"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${basePath}/api/UserProfile/GetMyProfile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      return response.json();
    },
  });
};

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: async (data: { id: string; bio?: string; profilePictureUrl?: string; linkedInUrl?: string; gitHubUrl?: string }) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${basePath}/api/UserProfile/UpdateProfile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.errorMessage?.message || "Failed to update profile");
      }

      return response.json();
    },
  });
};

export const useUpdateUser = () => {
  return useMutation({
    mutationFn: async (data: { id: string; name?: string; password?: string }) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${basePath}/api/User/Update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.errorMessage?.message || "Failed to update user");
      }

      return response.json();
    },
  });
};

export const useGetUsers = (page: number = 1, search: string = "") => {
  return useQuery({
    queryKey: ["users", page, search],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        Page: page.toString(),
        PageSize: "20",
        ...(search && { Search: search }),
      });
      const response = await fetch(`${basePath}/api/User/GetPage?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      return response.json();
    },
  });
};

export const useGetUserProfile = (userId: string) => {
  return useQuery({
    queryKey: ["userProfile", userId],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${basePath}/api/UserProfile/GetProfile/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }

      return response.json();
    },
    enabled: !!userId,
  });
};
