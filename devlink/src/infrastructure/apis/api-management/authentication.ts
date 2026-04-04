import type { LoginRecord } from "../client/models";
import { AuthorizationApi } from "../client/apis";
import { Configuration } from "../client/runtime";
import { useMutation } from "@tanstack/react-query";

const loginMutationKey = "loginMutation";

const basePath = import.meta.env.VITE_APP_API_BASE_URL || "http://localhost:5000";

export const useLogin = () => {
  return useMutation({
    mutationKey: [loginMutationKey],
    mutationFn: (loginRecord: LoginRecord) => {
      const api = new AuthorizationApi(new Configuration({ basePath }));
      return api.apiAuthorizationLoginPost({ loginRecord });
    },
  });
};
