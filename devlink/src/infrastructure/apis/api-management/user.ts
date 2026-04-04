import { useQuery } from "@tanstack/react-query";

const basePath = import.meta.env.VITE_APP_API_BASE_URL || "http://localhost:5000";

const getUserQueryKey = "getUserQuery";

export const useGetUser = (id?: string | null) => {
  return useQuery({
    queryKey: [getUserQueryKey, id],
    queryFn: async () => {
      if (!id) return undefined;
      const token = localStorage.getItem("token");
      const response = await fetch(`${basePath}/api/User/GetById/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

      return response.json();
    },
    enabled: !!id,
  });
};
