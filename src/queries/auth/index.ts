import {
  queryOptions,
  useMutation,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { MutationOptions } from "@/shared/types/query";
import { User } from "./type";
import { getUserInfo, updateUserInfo } from "./api";
import { KEYS } from "@/shared/constants/query-keys";

type UserQueryOptions = Omit<UseQueryOptions<User>, "queryKey">;
export const getUserQueryOptions = (options?: UserQueryOptions) =>
  queryOptions({
    ...options,
    queryKey: [KEYS.user.info],
  });

export const useUserInfo = (options?: UserQueryOptions) => {
  const queryOptions = getUserQueryOptions(options);
  return useQuery<User>({
    ...queryOptions,
    queryFn: getUserInfo,
  });
};

export const useUpdateUserInfo = (options?: MutationOptions<User>) => {
  return useMutation({
    ...options,
    mutationFn: updateUserInfo,
  });
};
