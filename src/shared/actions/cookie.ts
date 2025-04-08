"use server";

import { cookies } from "next/headers";

export async function setTokenInCookie(token: string) {
  "use server";
  const cookieStore = await cookies();

  cookieStore.set("accessToken", token, {
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 1000, // 1시간
  });
}

export async function removeTokens() {
  "use server";
  const cookieStore = await cookies();

  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
}
