"use server";

import { cookies } from "next/headers";
import { TOKEN } from "../constants/token";
import { TokenType } from "../types/token";

export const getCookie = async (key: string): Promise<string | null> => {
  "use server";
  const cookieStore = await cookies();
  const cookie = cookieStore.get(key);

  if (!cookie) {
    return null;
  }

  return cookie.value;
};

export const setTokenInCookie = async (type: TokenType, token: string) => {
  "use server";
  const cookieStore = await cookies();

  const maxAge = {
    [TOKEN.ACCESS_TOKEN]: 60 * 60 * 1000, // 1시간
    [TOKEN.REFRESH_TOKEN]: 60 * 60 * 24 * 7, // 7일
  };

  cookieStore.set(type, token, {
    maxAge: maxAge[type],
    secure: process.env.NODE_ENV === "production",
    httpOnly: type === TOKEN.REFRESH_TOKEN,
    sameSite: "strict",
  });
};

export async function removeTokens() {
  "use server";
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN.ACCESS_TOKEN);
  cookieStore.delete(TOKEN.REFRESH_TOKEN);
}
