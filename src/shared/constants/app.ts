import { PATH } from "@/shared/constants/path";

export const APP_NAME = "ssalon de";
export const APP_DESCRIPTION = "매출을 관리해보세요.";
export const APP_OAUTH_PROVIDER = {
  KAKAO: "kakao",
} as const;

export const AFTER_LOGIN_REDIRECT_PATH = PATH.DASHBOARD;

/** config */
export const FILTER_STALE_TIME = 0; // 5분
export const RETRY_COUNT = 3;
export const API_TIMEOUT = 1000 * 5; // 5초
export const ACCESS_TOKEN_EXPIRE = 60 * 60 * 1000; // 1시간
export const REFRESH_TOKEN_EXPIRE = 7 * 24 * 60 * 60 * 1000; // 7일
