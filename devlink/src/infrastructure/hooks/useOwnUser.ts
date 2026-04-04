import { useAppSelector } from "@/application/store";
import { useGetUser } from "@/infrastructure/apis/api-management";
import { UserRoleEnum } from "@/infrastructure/apis/client";
import { isUndefined } from "lodash";

export const useOwnUser = () => {
  const { userId } = useAppSelector((x) => x.profileReducer);
  const { data } = useGetUser(userId);
  return data?.response;
};

export const useOwnUserHasRole = (role: UserRoleEnum) => {
  const ownUser = useOwnUser();

  if (isUndefined(ownUser)) {
    return;
  }

  return ownUser?.role === role;
};

export const useTokenHasExpired = () => {
  const { loggedIn, exp } = useAppSelector((x) => x.profileReducer);
  const now = Date.now() / 1000;

  return {
    loggedIn,
    hasExpired: !exp || exp < now,
  };
};
