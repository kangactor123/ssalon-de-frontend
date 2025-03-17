import { BASE_URL } from "@/shared/constants/env";
import { ApiError } from "@/shared/types/error";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("refreshToken")?.value;

    const res = await fetch(`${BASE_URL}/auth/reissue`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const error: ApiError = await res.json();
      throw { message: error.message, status: error.status };
    }

    const tokens = await res.json();
    const accessToken = tokens.accessToken;
    const refreshToken = tokens.refreshToken;

    const response = NextResponse.json({ status: 200 });

    response.cookies.set("accessToken", accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 1,
    });

    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch {
    return NextResponse.error();
  }
}
