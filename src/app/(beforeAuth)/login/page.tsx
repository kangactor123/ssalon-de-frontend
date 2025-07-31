"use client";

import Image from "next/image";

import { useOAuthLogin } from "@/queries/auth";

import kakaoIcon from "@/assets/images/icons/kakao.svg";

import Loading from "@/shared/ui/loading";
import { APP_OAUTH_PROVIDER } from "@/shared/constants/app";

import forma_logo from "@/assets/images/logo/forma.png";

export default function Page() {
  const { isIdle, mutate: login } = useOAuthLogin();

  const loginHandler = async () => {
    const params = {
      provider: APP_OAUTH_PROVIDER.KAKAO,
    };

    login(params);
  };

  return (
    <div className="min-w-[320px] w-[520px] h-full m-auto bg-white shadow-xl pt-12 md:pt-[20vh] overflow-hidden">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-center mb-6">
          <Image src={forma_logo} alt="forma_logo" width="200" height="30" />
        </div>
        <h2 className="text-2xl font-bold text-center">로그인</h2>
        <div>
          <p className="text-gray-400 text-center">
            계정에 로그인하여 매출을 관리하고 목표를 달성해보세요
          </p>
          <p className="text-gray-400 text-center text-sm mt-2">
            소셜 로그인을 통해 간편하게 시작하세요
          </p>
        </div>
        <div className="flex items-center justify-center mb-4">
          <Image
            src={kakaoIcon}
            alt="kakaoIcon"
            className="cursor-pointer"
            onClick={loginHandler}
          />
        </div>
      </div>
      {!isIdle && <Loading className="fixed w-[100vw] h-[100vh] bg-black-10" />}
    </div>
  );
}
