import { logout, reissue } from "@/queries/auth/api";
import axios, { AxiosRequestConfig } from "axios";

import qs from "qs";

import Cookies from "js-cookie";
import { BASE_URL } from "../constants/env";

// 토큰 재발급 중 중복 요청을 방지하기 위한 변수
let isRefreshing = false;

const api = createApiInstance();

function paramsSerializer(params: unknown): string {
  return qs.stringify(params);
}

function getCookie(key: string) {
  return Cookies.get(key);
}

function createApiInstance(bearerJwt = "", options: AxiosRequestConfig = {}) {
  const api = axios.create({
    baseURL: BASE_URL,
    timeout: 0,
    withCredentials: true,
    paramsSerializer: {
      serialize: paramsSerializer,
    },
    ...options,
  });
  api.defaults.headers.common["Authorization"] = bearerJwt;
  return api;
}

api.interceptors.request.use((config) => {
  const accessToken = getCookie("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (result) => result,
  async (error) => {
    if (error === undefined) throw error;
    if (error.response?.status === 401) {
      try {
        if (!isRefreshing) {
          isRefreshing = true;
          const res = await reissue();

          if (res.status === 200) {
            const accessToken = getCookie("accessToken");
            const retryConfig = {
              ...error.config,
              headers: {
                ...error.config.headers,
                Authorization: `Bearer ${accessToken}`,
              },
            };
            return api(retryConfig);
          } else {
            throw new Error("Unauthorized: Invalid token");
          }
        }
      } catch {
        await logout();
        window.location.href = "/login";
      } finally {
        isRefreshing = false;
      }
    } else if (error) {
      const e = { ...error.response?.data, status: error.response?.status };
      throw e;
    }

    return Promise.reject(error);
  }
);

export default api;
