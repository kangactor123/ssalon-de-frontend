import { useCallback } from "react";
import { signOut } from "next-auth/react";
import { removeTokens } from "../actions/cookie";
import useUserStore from "@/zustand/user";

export const useLogout = () => {
  const { setUser } = useUserStore();

  const handleLogout = useCallback(async () => {
    setUser({ email: "", name: "", company: "", createdAt: "" });
    await removeTokens();
    await signOut({ callbackUrl: "/login" });
  }, [setUser]);

  return handleLogout;
};
