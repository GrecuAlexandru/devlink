import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const basePath = import.meta.env.VITE_APP_API_BASE_URL || "http://localhost:5000";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export type FeedbackQuality = "Poor" | "Average" | "Excellent";

export type FeedbackPayload = {
  quality: FeedbackQuality;
  wouldRecommend: boolean;
  allowContact: boolean;
  message: string;
};

export const useSubmitFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FeedbackPayload) => {
      const response = await fetch(`${basePath}/api/Feedback/Add`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.errorMessage?.message || "Failed to submit feedback");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedbackList"] });
    },
  });
};

export const useGetFeedbackList = (enabled: boolean) => {
  return useQuery({
    queryKey: ["feedbackList"],
    queryFn: async () => {
      const response = await fetch(`${basePath}/api/Feedback/GetAll`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.errorMessage?.message || "Failed to fetch feedback");
      }

      return response.json();
    },
    enabled,
  });
};
