import { useEffect, useMemo } from "react";
import { useStore } from "zustand";
import useUserStore from "@/zustand/user";
import { useUserInfo } from "@/queries/auth";

type Result = {
  isLoading: boolean;
  enabledInitialize: boolean;
};

export const useInitUserInfo = (): Result => {
  const user = useStore(useUserStore, (state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const enabledInitialize = useMemo(() => !user?.email && !user?.name, [user]);
  const { data: userInfo, isLoading } = useUserInfo({
    enabled: enabledInitialize,
  });

  useEffect(() => {
    if (enabledInitialize) {
      setUser({
        email: userInfo?.email || "",
        name: userInfo?.name || "",
        company: userInfo?.company || "",
        createdAt: userInfo?.createdAt || "",
      });
    }
  }, [userInfo, enabledInitialize, setUser]);

  return { isLoading, enabledInitialize };
};
