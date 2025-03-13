"use client";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useToast } from "@/shared/hooks/use-toast";
import { ERROR_MESSAGE } from "@/shared/constants/api-error";
import { ApiError } from "@/shared/types/error";
import useUserStore from "@/zustand/user";
import { Label } from "@radix-ui/react-label";
import { Scissors } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { login } from "@/queries/auth/api";
import Spinner from "@/shared/ui/spinner";
import { EMAIL_REGEX } from "@/shared/constants/regex";

export default function Page() {
  const router = useRouter();
  const { setUser } = useUserStore();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");

  const isDisabled = useMemo(() => {
    return email === "" || password === "" || !EMAIL_REGEX.test(email);
  }, [email, password]);

  const handleLogin = useCallback(
    async (event: React.SyntheticEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsLoading(true);
      const data = await login({ email, password });

      if (
        Object.hasOwn(data, "code") ||
        (data as unknown as ApiError).message === "fetch failed"
      ) {
        setIsLoading(false);
        const { code } = data as unknown as ApiError;

        switch (code) {
          case ERROR_MESSAGE.invalid_credentials.code:
          case ERROR_MESSAGE.validation_failed.code:
            return toast({
              variant: "destructive",
              description: ERROR_MESSAGE.validation_failed.message,
            });
        }
      } else {
        setUser({
          email: data.user.email,
          name: data.user.name,
          company: data.user.company,
          createdAt: data.user.createdAt,
        });
        router.push("/dashboard");
      }
    },
    [email, password, router, toast, setUser]
  );

  return (
    <div className="min-w-[320px] w-[520px] h-full m-auto bg-white shadow-xl pt-12 md:pt-[20vh] overflow-hidden">
      <div className="flex flex-col gap-2 mb-8">
        <div className="flex items-center justify-center mb-6">
          <Scissors className="w-12 h-12 text-blue-600" />
          <span className="ml-2 text-2xl font-bold text-gray-800">
            ssalon de
          </span>
        </div>
        <h2 className="text-2xl font-bold text-center">로그인</h2>
        <p className="text-gray-400 text-center">
          계정에 로그인하여 매출을 관리하세요
        </p>
      </div>
      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-4 max-w-[420px] mx-auto p-6 pt-0"
      >
        <div className="space-y-2">
          <Label htmlFor="email">이메일</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">비밀번호</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button className="w-full mt-2" disabled={isDisabled}>
          {isLoading && <Spinner className="mr-2" />}
          로그인
        </Button>
      </form>
      <div className="flex flex-col items-center space-y-4">
        <div className="space-y-2 text-sm text-center">
          {/* <a href="#" className="text-blue-600 hover:underline">
            비밀번호를 잊으셨나요?
          </a> */}
          <div className="flex gap-1">
            계정이 없으신가요?
            <Link href="/sign-up" className="text-blue-600 hover:underline">
              회원가입
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
