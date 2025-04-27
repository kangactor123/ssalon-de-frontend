import { PATH } from "./path";

export const APP_NAME = "ssalon de";
export const APP_DESCRIPTION = "매출을 관리해보세요.";
export const APP_OAUTH_PROVIDER = {
  KAKAO: "kakao",
} as const;

export const AFTER_LOGIN_REDIRECT_PATH = PATH.DASHBOARD;

/** config */
export const FILTER_STALE_TIME = Infinity;
export const RETRY_COUNT = 0;
