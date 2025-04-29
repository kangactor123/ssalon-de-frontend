"use server";

import { cookies } from "next/headers";
import { TOKEN } from "../constants/token";
import { TokenType } from "../types/token";
import { ACCESS_TOKEN_EXPIRE, REFRESH_TOKEN_EXPIRE } from "../constants/app";

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
    [TOKEN.ACCESS_TOKEN]: ACCESS_TOKEN_EXPIRE,
    [TOKEN.REFRESH_TOKEN]: REFRESH_TOKEN_EXPIRE,
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
