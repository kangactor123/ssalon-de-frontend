import { redirect } from "next/navigation";

import { BASE_URL } from "@/shared/constants/env";
import { reissue } from "@/queries/auth/api";
import { TOKEN } from "@/shared/constants/token";
import {
  getCookie,
  removeTokens,
  setTokenInCookie,
} from "@/shared/actions/cookie";
import { PATH } from "@/shared/constants/path";

export async function serverFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const accessToken = await getCookie(TOKEN.ACCESS_TOKEN);

  const headers = new Headers({
    ...options.headers,
    "Content-Type": "application/json",
  });

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (response.status === 401) {
    const refreshToken = await getCookie(TOKEN.REFRESH_TOKEN);

    if (!refreshToken) {
      throw new Error("Unauthorized: Invalid token");
    }

    try {
      const reissueResponse = await reissue();

      if (!reissueResponse.ok) {
        throw new Error("Unauthorized: Invalid token");
      }

      const { accessToken: reissueAccessToken } = await reissueResponse.json();

      await setTokenInCookie(TOKEN.ACCESS_TOKEN, reissueAccessToken);

      headers.set("Authorization", `Bearer ${reissueAccessToken}`);

      const retryResponse = await fetch(`${BASE_URL}${url}`, {
        ...options,
        headers,
        credentials: "include",
      });

      if (!retryResponse.ok) {
        throw new Error("Unauthorized: Invalid token");
      }

      return retryResponse.json();
    } catch {
      await removeTokens();
      redirect(PATH.LOGIN);
    }
  }

  return response.json();
}
