import { useCallback } from "react";
import useUserStore, { initialUser } from "@/zustand/user";
import { useOauthLogout } from "@/queries/auth";
import { removeTokens } from "@/shared/actions/cookie";
import { PATH } from "@/shared/constants/path";

type LogoutReturnType = {
  isLogoutIdle: boolean;
  onLogout: () => Promise<void>;
};

export const useLogout = (): LogoutReturnType => {
  const { setUser } = useUserStore();
  const { mutateAsync: logout, isIdle } = useOauthLogout();

  const handleLogout = useCallback(async () => {
    setUser(initialUser);
    await removeTokens();
    await logout({ callbackUrl: PATH.LOGIN });
  }, [logout, setUser]);

  return {
    onLogout: handleLogout,
    isLogoutIdle: isIdle,
  };
};
