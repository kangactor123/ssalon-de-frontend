import { BASE_URL } from "@/shared/constants/env";

export async function getTokens(email: string, provider: string) {
  "use server";
  const requestBody = {
    email,
    provider,
  };

  const res = await fetch(`${BASE_URL}/auth/oauth`, {
    method: "POST",
    body: JSON.stringify(requestBody),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res;
}
