import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { decode, getToken } from "next-auth/jwt";
import { PATH } from "./shared/constants/path";
import { PathValue } from "./shared/types/route";

export async function middleware(req: NextRequest) {
  const BEFORE_AUTH_ROUTES: PathValue[] = [PATH.LOGIN];
  const url = req.nextUrl.clone();

  const redirectTo = (destination: string) =>
    NextResponse.redirect(new URL(destination, url));

  const urlPathname = url.pathname as PathValue;

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    raw: true,
  });

  try {
    const isBeforeAuthRoute = BEFORE_AUTH_ROUTES.includes(urlPathname);
    const decoded = await decode({
      token,
      secret: process.env.NEXTAUTH_SECRET!,
    });

    if (decoded) {
      if (isBeforeAuthRoute || urlPathname === PATH.ROOT) {
        return redirectTo(PATH.DASHBOARD);
      } else {
        return NextResponse.next();
      }
    } else {
      if (isBeforeAuthRoute) {
        return NextResponse.next();
      } else {
        return redirectTo(PATH.LOGIN);
      }
    }
  } catch {
    return redirectTo(PATH.LOGIN);
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
