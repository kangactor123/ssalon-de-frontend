import { BASE_URL } from "@/shared/constants/env";
import NextAuth from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";
import { cookies } from "next/headers";

const handler = NextAuth({
  providers: [
    KakaoProvider({
      clientId: process.env.NEXT_KAKAO_CLIENT_ID!,
      clientSecret: process.env.NEXT_KAKAO_SECRET!,
    }),
  ],
  session: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
  },
  callbacks: {
    async signIn({ user, account }) {
      const cookieStore = await cookies();
      let isSuccess: boolean | string = false;

      if (account?.provider && user?.email) {
        const requestBody = {
          email: user?.email ?? "",
          provider: account?.provider ?? "",
        };

        try {
          const res = await fetch(`${BASE_URL}/auth/oauth`, {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (res.ok) {
            const data = await res.json();

            cookieStore.set("accessToken", data.accessToken, {
              secure: process.env.NODE_ENV === "production",
              sameSite: "strict",
              maxAge: 60 * 60 * 1000, // 1시간
            });

            cookieStore.set("refreshToken", data.refreshToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "strict",
              maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
            });
          }

          isSuccess = true;
        } catch (error) {
          console.log(error);
        }
      }

      return isSuccess;
    },
    async jwt({ token, account }) {
      if (account?.provider && account?.access_token) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }
      return token;
    },

    async session({ session, token }) {
      if (token?.accessToken && session.user) {
        session = {
          ...session,
          accessToken: token.accessToken,
          provider: token.provider,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
