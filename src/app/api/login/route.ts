import { BASE_URL } from "@/shared/constants/env";
import { ApiError } from "@/shared/types/error";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const requestBody = await req.json();
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const error: ApiError = await res.json();
      return NextResponse.json(
        { code: error.code, message: error.message },
        { status: error.status }
      );
    }

    const { user, accessToken, refreshToken } = await res.json();

    const response = NextResponse.json({ user: user });

    // Access Token 설정 (HttpOnly X -> 클라이언트에서 접근 가능)
    response.cookies.set("accessToken", accessToken, {
      httpOnly: false, // 필요하면 true로 설정
      secure: process.env.NODE_ENV === "production", // 배포 시 true
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 1, // 1시간 (초 단위)
    });

    // Refresh Token 설정 (HttpOnly, Secure)
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true, // 클라이언트에서 접근 불가능
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7일 유지
    });

    return response;
  } catch (error) {
    const err = error as ApiError;
    return NextResponse.json(
      { code: err.code, message: err.message },
      { status: err.status }
    );
  }
}
