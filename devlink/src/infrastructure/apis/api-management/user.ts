import { UserApi, type UserRecordRequestResponse } from "../client/apis";
import { useQuery } from "@tanstack/react-query";

const getUserQueryKey = "getUserQuery";

export const useGetUser = (id?: string | null) => {
  return useQuery<UserRecordRequestResponse | undefined>({
    queryKey: [getUserQueryKey, id],
    queryFn: async () => {
      if (!id) return undefined;
      const userApi = new UserApi();
      return userApi.apiUserGet({ id });
    },
    enabled: !!id,
  });
};
