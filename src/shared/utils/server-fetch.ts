import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { BASE_URL } from "@/shared/constants/env";

async function reissue(token: string) {
  try {
    const res = await fetch(`${BASE_URL}/auth/reissue`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return res;
  } catch (error) {
    throw error;
  }
}

async function logout() {
  try {
    const res = await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    return res;
  } catch (error) {
    throw error;
  }
}

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
      const reissueResponse = await reissue(refreshToken);

      if (!reissueResponse.ok) {
        throw new Error("Unauthorized: Invalid token");
      }

      const { accessToken: reissueAccessToken } = await reissueResponse.json();

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
      logout();
      redirect("/login");
    }
  }

  return response.json();
}
