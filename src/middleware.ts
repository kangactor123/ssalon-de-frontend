import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { decode, getToken } from "next-auth/jwt";

// sign-up, find-password 제거 (oauth만 유지)
const BEFORE_AUTH_ROUTES = ["/", "/login"];

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const redirectTo = (dest: string) =>
    NextResponse.redirect(new URL(dest, url));

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    raw: true,
  });

  try {
    const isBeforeAuthRoute = BEFORE_AUTH_ROUTES.includes(url.pathname);
    const decoded = await decode({
      token,
      secret: process.env.NEXTAUTH_SECRET!,
    });

    if (decoded) {
      return NextResponse.next();
    } else {
      if (isBeforeAuthRoute) {
        return NextResponse.next();
      } else {
        return redirectTo("/login");
      }
    }
  } catch {
    return redirectTo("/login");
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
