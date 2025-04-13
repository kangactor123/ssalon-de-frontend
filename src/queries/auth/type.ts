import { APP_OAUTH_PROVIDER } from "@/shared/constants/app";

export type User = {
  email: string;
  name: string;
  company: string;
  createdAt: string;
};

export type OAuthProvider =
  (typeof APP_OAUTH_PROVIDER)[keyof typeof APP_OAUTH_PROVIDER];

export type OAuthLoginParams = {
  provider: OAuthProvider;
  callbackUrl?: string;
  redirect?: boolean;
};

export type OAuthLogoutParams = {
  callbackUrl?: string;
};
