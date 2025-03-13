"use client";

import { useRouter } from "next/navigation";
import { Scissors } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useForm, useWatch } from "react-hook-form";
import { RequiredLabel } from "@/shared/ui/required-label";
import { useSignUp } from "@/queries/auth";
import { useToast } from "@/shared/hooks/use-toast";
import { useIsMutating } from "@tanstack/react-query";
import { KEYS } from "@/shared/constants/query-keys";
import Spinner from "@/shared/ui/spinner";
import { SignUpDTO } from "@/queries/auth/type";
import { useCallback } from "react";
import { ApiError } from "@/shared/types/error";
import { ERROR_MESSAGE } from "@/shared/constants/api-error";
import Link from "next/link";
import { EMAIL_REGEX, PASSWROD_REGEX } from "@/shared/constants/regex";

type SignUpForm = SignUpDTO & {
  confirmPassword: string;
};

const defaultValues: SignUpForm = {
  email: "",
  name: "",
  company: "",
  password: "",
  confirmPassword: "",
};

export default function SignUp() {
  const router = useRouter();
  const { toast } = useToast();

  const { register, handleSubmit, formState, control, setError } = useForm({
    defaultValues,
    mode: "onChange",
  });
  const { mutate: signUp } = useSignUp({
    onSuccess: () => {
      toast({
        description:
          "회원가입을 축하합니다. 입력한 이메일에서 계정을 인증해주세요.",
        variant: "destructive",
      });
      router.push("/login");
    },
    onError: (error) => {
      const apiError = error as ApiError;
      if (apiError.message === ERROR_MESSAGE.EMAIL_DUPLICATED.code) {
        setError("email", { message: ERROR_MESSAGE.EMAIL_DUPLICATED.message });

        return toast({
          description: ERROR_MESSAGE.EMAIL_DUPLICATED.message,
          variant: "destructive",
        });
      } else {
        toast({
          description: "알 수 없는 애러가 발생했습니다.",
          variant: "destructive",
        });
      }
    },
  });

  const password = useWatch({ control, name: "password" });
  const confirmPassword = useWatch({ control, name: "confirmPassword" });
  const isLoading = useIsMutating({ mutationKey: [KEYS.user.signUp] });

  const onSubmit = useCallback(
    (data: SignUpDTO) => {
      if (formState.isValid) {
        signUp({
          email: data.email,
          name: data.name,
          password: data.password,
          company: data.company,
        });
      }
    },
    [formState, signUp]
  );

  return (
    <div className="min-w-[320px] w-[520px] md:h-full pb-8 m-auto bg-white shadow-xl pt-6 md:pt-[5vh] overflow-auto">
      <div className="flex flex-col gap-2 mb-8">
        <div className="flex items-center justify-center mb-6">
          <Scissors className="w-12 h-12 text-blue-600" />
          <span className="ml-2 text-2xl font-bold text-gray-800">
            ssalon de
          </span>
        </div>
        <h2 className="text-2xl font-bold text-center">회원가입</h2>
        <p className="text-gray-400 text-center">
          새 계정을 만들어 매출을 관리하세요
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 max-w-[420px] mx-auto p-6 pt-0"
      >
        <div className="space-y-2">
          <RequiredLabel
            htmlFor="email"
            required
            errorMessage={formState.errors.email?.message}
          >
            이메일
          </RequiredLabel>
          <Input
            {...register("email", {
              required: "이메일을 입력해주세요.",
              pattern: {
                value: EMAIL_REGEX,
                message: "유효한 이메일 주소를 입력하세요",
              },
            })}
            id="email"
            type="email"
            placeholder="name@example.com"
            isError={!!formState.errors.email}
            required
          />
          <p className="text-xs text-red-500">
            계정 생성 후 메일함에서 인증 메일을 클릭해주세요.
          </p>
        </div>
        <div className="space-y-2">
          <RequiredLabel
            htmlFor="name"
            required
            errorMessage={formState.errors.name?.message}
          >
            이름
          </RequiredLabel>
          <Input
            {...register("name", {
              required: "이름을 입력해주세요.",
              maxLength: {
                value: 8,
                message: "이름은 8글자 이내로 입력해주세요.",
              },
            })}
            maxLength={8}
            id="name"
            required
            placeholder="8 글자 이내로 이름을 입력해주세요."
            isError={!!formState.errors.name}
          />
        </div>
        <div className="space-y-2">
          <RequiredLabel
            htmlFor="company"
            required
            errorMessage={formState.errors.company?.message}
          >
            매장
          </RequiredLabel>
          <Input
            {...register("company", {
              required: "매장명을 입력해주세요.",
              maxLength: {
                value: 20,
                message: "매장명은 20글자 이내로 입력해주세요.",
              },
            })}
            maxLength={20}
            placeholder="20 글자 이내로 매장명을 입력해주세요."
            id="company"
            required
            isError={!!formState.errors.company}
          />
        </div>
        <div className="space-y-2">
          <RequiredLabel
            htmlFor="password"
            required
            errorMessage={formState.errors.password?.message}
          >
            비밀번호
          </RequiredLabel>
          <Input
            {...register("password", {
              required: "비밀번호를 입력해주세요.",
              deps: ["confirmPassword"],
              pattern: {
                value: PASSWROD_REGEX,
                message:
                  "비밀번호는 반드시 특수문자가 하나 이상 포함되어야 하며 영 대소문자만 입력이 가능합니다.",
              },
              maxLength: {
                value: 29,
                message: "비밀번호는 20자 이내로 입력해주세요.",
              },
            })}
            id="password"
            type="password"
            placeholder="••••••••"
            isError={!!formState.errors.password}
            required
          />
          <p className="text-xs text-red-500">
            비밀번호는 영문자와 숫자, 특수문자를 포함한 20자 이내로
            입력해주세요.
          </p>
        </div>
        <div className="space-y-2">
          <RequiredLabel
            htmlFor="password"
            required
            errorMessage={formState.errors.confirmPassword?.message}
          >
            비밀번호 확인
          </RequiredLabel>
          <Input
            {...register("confirmPassword", {
              required: "비밀번호를 확인해주세요.",
              deps: ["password"],
              validate: (value) =>
                value === password || "비밀번호가 일치하지 않습니다.",
            })}
            id="password"
            type="password"
            placeholder="••••••••"
            isError={!!formState.errors.confirmPassword}
            required
          />
          {!!confirmPassword && password === confirmPassword && (
            <p className="text-xs text-green-700">
              입력하신 비밀번호가 일치합니다.
            </p>
          )}
        </div>
        <Button
          type="submit"
          className="w-full mt-2"
          disabled={!formState.isValid}
        >
          {!!isLoading && <Spinner />}
          회원가입
        </Button>
      </form>
      <div className="flex flex-col items-center space-y-4 text-sm">
        이미 계정이 있으신가요?
        <Link href="/login" className="text-blue-600 hover:underline mt-2">
          로그인
        </Link>
      </div>
    </div>
  );
}
