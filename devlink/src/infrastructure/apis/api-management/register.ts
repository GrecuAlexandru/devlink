import { useMutation } from "@tanstack/react-query";

const basePath = import.meta.env.VITE_APP_API_BASE_URL || "http://localhost:5000";

export type RegisterRequest = {
  email: string;
  password: string;
  name: string;
  userType: "User" | "CompanyOwner";
};

const registerMutationKey = "registerMutation";

export const useRegister = () => {
  return useMutation({
    mutationKey: [registerMutationKey],
    mutationFn: async (data: RegisterRequest) => {
      const response = await fetch(`${basePath}/api/Authorization/Register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          name: data.name,
          role: data.userType === "CompanyOwner" ? "CompanyAdmin" : "Client",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.errorMessage?.message || "Registration failed");
      }

      return response.json();
    },
  });
};
