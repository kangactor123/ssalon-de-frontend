import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { BASE_URL } from "@/shared/constants/env";
import { reissue } from "@/queries/auth/api";

export async function serverFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

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
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      throw new Error("Unauthorized: Invalid token");
    }

    try {
      const reissueResponse = await reissue();

      if (!reissueResponse.ok) {
        throw new Error("Unauthorized: Invalid token");
      }

      const { accessToken: reissueAccessToken } = await reissueResponse.json();

      headers.set("Authorization", `Bearer ${reissueAccessToken}`);

      cookieStore.set("accessToken", reissueAccessToken, {
        maxAge: 60 * 60 * 1000, // 1시간
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

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
      cookieStore.delete("accessToken");
      cookieStore.delete("refreshToken");
      redirect("/login");
    }
  }

  return response.json();
}
