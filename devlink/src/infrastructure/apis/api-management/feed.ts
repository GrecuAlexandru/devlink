import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const basePath = import.meta.env.VITE_APP_API_BASE_URL || "http://localhost:5000";

const getHeaders = (isFormData: boolean = false) => {
  const token = localStorage.getItem("token");
  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
  };
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
};

export const useGetFeed = () => {
  return useQuery({
    queryKey: ["feed"],
    queryFn: async () => {
      const response = await fetch(`${basePath}/api/Post/GetFeed`, {
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch feed");
      return response.json();
    },
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { content: string; images?: FileList | null }) => {
      const formData = new FormData();
      formData.append("content", data.content);
      if (data.images) {
        // Limit to max 4 images
        const filesCount = Math.min(data.images.length, 4);
        for (let i = 0; i < filesCount; i++) {
          formData.append("images", data.images[i]);
        }
      }

      const response = await fetch(`${basePath}/api/Post/Create`, {
        method: "POST",
        headers: getHeaders(true),
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err?.errorMessage?.message || "Failed to create post");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postId: string) => {
      const response = await fetch(`${basePath}/api/Post/Delete/${postId}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err?.errorMessage?.message || "Failed to delete post");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postId: string) => {
      const response = await fetch(`${basePath}/api/Post/Like/${postId}`, {
        method: "POST",
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error("Failed to like post");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });
};

export const useUnlikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postId: string) => {
      const response = await fetch(`${basePath}/api/Post/Unlike/${postId}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error("Failed to unlike post");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { postId: string; content: string }) => {
      const response = await fetch(`${basePath}/api/Post/Comment`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err?.errorMessage?.message || "Failed to add comment");
      }
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["comments", variables.postId] });
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (commentId: string) => {
      const response = await fetch(`${basePath}/api/Post/DeleteComment/${commentId}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err?.errorMessage?.message || "Failed to delete comment");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      // To strictly target specific post comment lists we would need the postId, but revalidating all or feed is fine.
    },
  });
};

export const useGetPostComments = (postId: string) => {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const response = await fetch(`${basePath}/api/Post/GetComments/${postId}`, {
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch comments");
      return response.json();
    },
    enabled: !!postId,
  });
};
