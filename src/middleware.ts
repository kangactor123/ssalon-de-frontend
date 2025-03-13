import { NextRequest, NextResponse } from "next/server";
import { supabaseService } from "./shared/lib/supabase";

const AUTH_PAGES = ["/", "/login", "/sign-up", "/find-password"];

const logout = async (url: string) => {
  const response = NextResponse.redirect(new URL("/login", url));
  await supabaseService.logout();

  response.cookies.delete("accessToken");
  response.cookies.delete("refreshToken");
  return response;
};

export async function middleware(req: NextRequest) {
  const { nextUrl, cookies } = req;

  const accessToken = cookies.get("accessToken")?.value;
  const refreshToken = cookies.get("refreshToken")?.value ?? "";

  const isBeforeAuthPage = AUTH_PAGES.includes(nextUrl.pathname);

  if (nextUrl.pathname === "/") {
    if (accessToken) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    } else {
      if (nextUrl.pathname === "/") {
        return NextResponse.redirect(new URL("/login", req.url));
      } else {
        return NextResponse.next();
      }
    }
  }

  if (isBeforeAuthPage) {
    return NextResponse.next();
  }

  if (!accessToken) {
    return logout(req.url);
  }

  const isValid = await supabaseService.isValidToken(accessToken);

  if (isValid) {
    return NextResponse.next();
  }

  if (!refreshToken) {
    return logout(req.url);
  }

  const { data, error } = await supabaseService.reissueToken(refreshToken);

  if (data) {
    const response = NextResponse.next();
    const accessToken = data.session?.access_token ?? "";
    const refreshToken = data.session?.refresh_token ?? "";

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
  }

  if (error) {
    return logout(req.url);
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
