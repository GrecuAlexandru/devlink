import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const basePath = import.meta.env.VITE_APP_API_BASE_URL || "http://localhost:5000";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const useGetMyConnections = () => {
  return useQuery({
    queryKey: ["connections"],
    queryFn: async () => {
      const response = await fetch(`${basePath}/api/Connection/GetMyConnections`, {
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch connections");
      return response.json();
    },
  });
};

export const useGetPendingRequests = () => {
  return useQuery({
    queryKey: ["pendingRequests"],
    queryFn: async () => {
      const response = await fetch(`${basePath}/api/Connection/GetPendingRequests`, {
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch pending requests");
      return response.json();
    },
  });
};

export const useGetSentRequests = () => {
  return useQuery({
    queryKey: ["sentRequests"],
    queryFn: async () => {
      const response = await fetch(`${basePath}/api/Connection/GetSentRequests`, {
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch sent requests");
      return response.json();
    },
  });
};

export const useGetConnectionStatus = (userId: string) => {
  return useQuery({
    queryKey: ["connectionStatus", userId],
    queryFn: async () => {
      const response = await fetch(`${basePath}/api/Connection/GetStatus/${userId}`, {
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch connection status");
      return response.json();
    },
    enabled: !!userId,
  });
};

export const useSendConnectionRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (receiverId: string) => {
      const response = await fetch(`${basePath}/api/Connection/SendRequest`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ receiverId }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err?.errorMessage?.message || "Failed to send request");
      }
      return response.json();
    },
    onSuccess: (_, receiverId) => {
      queryClient.invalidateQueries({ queryKey: ["connectionStatus", receiverId] });
      queryClient.invalidateQueries({ queryKey: ["sentRequests"] });
    },
  });
};

export const useAcceptConnection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (connectionId: string) => {
      const response = await fetch(`${basePath}/api/Connection/AcceptRequest/${connectionId}`, {
        method: "PUT",
        headers: getHeaders(),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err?.errorMessage?.message || "Failed to accept request");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingRequests"] });
      queryClient.invalidateQueries({ queryKey: ["connections"] });
      queryClient.invalidateQueries({ queryKey: ["connectionStatus"] });
    },
  });
};

export const useRejectConnection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (connectionId: string) => {
      const response = await fetch(`${basePath}/api/Connection/RejectRequest/${connectionId}`, {
        method: "PUT",
        headers: getHeaders(),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err?.errorMessage?.message || "Failed to reject request");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingRequests"] });
      queryClient.invalidateQueries({ queryKey: ["connectionStatus"] });
    },
  });
};

export const useRemoveConnection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (connectionId: string) => {
      const response = await fetch(`${basePath}/api/Connection/Remove/${connectionId}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err?.errorMessage?.message || "Failed to remove connection");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["connections"] });
      queryClient.invalidateQueries({ queryKey: ["connectionStatus"] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });
};
