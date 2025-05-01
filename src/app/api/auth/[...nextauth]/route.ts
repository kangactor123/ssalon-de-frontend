import NextAuth from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";

import { setTokenInCookie } from "@/shared/actions/cookie";
import { getTokens } from "@/shared/actions/session";
import { ACCESS_TOKEN_EXPIRE } from "@/shared/constants/app";
import { PATH } from "@/shared/constants/path";
import { TOKEN } from "@/shared/constants/token";

const handler = NextAuth({
  providers: [
    KakaoProvider({
      clientId: process.env.NEXT_KAKAO_CLIENT_ID!,
      clientSecret: process.env.NEXT_KAKAO_SECRET!,
    }),
  ],
  session: {
    maxAge: ACCESS_TOKEN_EXPIRE,
  },
  callbacks: {
    async signIn({ user, account }) {
      let isSuccess: boolean | string = false;

      if (account?.provider && user?.email) {
        try {
          const email = user?.email ?? "";
          const provider = account?.provider ?? "";
          const res = await getTokens(email, provider);

          if (res.ok) {
            const data = await res.json();
            await setTokenInCookie(TOKEN.ACCESS_TOKEN, data.accessToken);
            await setTokenInCookie(TOKEN.REFRESH_TOKEN, data.refreshToken);
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
    signIn: PATH.LOGIN,
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
