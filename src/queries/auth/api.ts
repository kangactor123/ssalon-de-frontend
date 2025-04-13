import api from "@/shared/lib/axios";

import { OAuthLoginParams, OAuthLogoutParams, User } from "./type";
import { BASE_URL } from "@/shared/constants/env";
import { signIn, signOut } from "next-auth/react";
import { PATH } from "@/shared/constants/path";

export async function oauthLogin(params: OAuthLoginParams) {
  const { provider, callbackUrl, redirect } = params;
  return signIn(provider, {
    callbackUrl,
    redirect,
  });
}

export async function oauthLogout(params: OAuthLogoutParams) {
  const { callbackUrl } = params;
  return signOut({ callbackUrl: callbackUrl ?? PATH.LOGIN });
}

export async function reissue() {
  try {
    const res = await fetch(`${BASE_URL}/auth/reissue`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return res;
  } catch (error) {
    throw error;
  }
}

export async function getUserInfo() {
  const { data } = await api({
    method: "GET",
    url: "/auth/info",
  });

  return data;
}

export async function updateUserInfo(dto: User) {
  const { data } = await api({
    method: "PUT",
    url: "/auth/info",
    data: dto,
  });

  return data;
}
