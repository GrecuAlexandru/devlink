import { useMutation } from "@tanstack/react-query";

const basePath = import.meta.env.VITE_APP_API_BASE_URL || "http://localhost:5000";

export const useCreateCompany = () => {
  return useMutation({
    mutationFn: async (data: { name: string; industry: string; website?: string }) => {
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
