import api, { BASE_URL, getCookie } from "@/shared/lib/axios";

import { AuthDto, SignUpDTO, User } from "./type";
import { encryptPassword } from "@/shared/utils/encrypt";
import { isServer } from "@/shared/utils/isServer";

export const login = async (dto: AuthDto): Promise<{ user: User }> => {
  try {
    const encryptedPassword = encryptPassword(dto.password);
    const data: { user: User } = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ ...dto, password: encryptedPassword }),
    }).then((res) => {
      const data = res.json();
      return data;
    });

    return data;
  } catch (error) {
    throw error;
  }
};

export async function logout() {
  try {
    const { status } = await fetch("/api/logout", {
      method: "POST",
    });

    console.log("logout status", status);
    return status;
  } catch (error) {
    throw error;
  }
}

export async function reissue(token: string) {
  console.log(token);
  try {
    const body = JSON.stringify({ token: token });

    console.log(body);

    const { status } = await fetch(`${BASE_URL}/auth/reissue`, {
      method: "POST",
      body,
    });

    console.log("reissue status", status);
    return status;
  } catch (error) {
    throw error;
  }
}

export async function getUserInfo() {
  const { data } = await api({
    method: "GET",
    url: "/auth/info",
  });

  return data;
}

export async function updateUserInfo(dto: User) {
  const { data } = await api({
    method: "PUT",
    url: "/auth/info",
    data: dto,
  });

  return data;
}

export async function signUp(dto: SignUpDTO) {
  const encryptedPassword = encryptPassword(dto.password);

  const { data } = await api({
    method: "POST",
    url: "/auth/sign-up",
    data: {
      ...dto,
      password: encryptedPassword,
    },
  });

  return data;
}
