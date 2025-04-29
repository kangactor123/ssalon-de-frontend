// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    accessToken: string;
  }
  interface Session {
    accessToken: string;
    provider: string;
    email: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    provider: string;
  }
}
