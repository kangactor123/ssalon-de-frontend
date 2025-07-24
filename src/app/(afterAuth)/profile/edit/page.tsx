"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardFooter,
} from "@/shared/ui/card";
import Spinner from "@/shared/ui/spinner";

import { useForm } from "react-hook-form";
import { User } from "@/queries/auth/type";
import { useUpdateUserInfo, useUserInfo } from "@/queries/auth";
import { useToast } from "@/shared/hooks/use-toast";
import useUserStore from "@/zustand/user";
import PageTitle from "@/shared/ui/page-title";

export default function EditProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { setUser } = useUserStore();

  const { register, handleSubmit, reset, formState, getValues } = useForm<User>(
    {
      defaultValues: {
        name: "",
        company: "",
        email: "",
      },
    }
  );

  const { data: userInfo, isSuccess, isError } = useUserInfo();

  const { mutate: update, isPending } = useUpdateUserInfo({
    onSuccess: () => {
      const userInfo = getValues();
      setUser({
        email: userInfo.email,
        name: userInfo.name,
        company: userInfo.company,
        createdAt: userInfo.createdAt,
      });
      router.push("/profile");
    },
    onError: () => {
      toast({
        description: "개인정보 수정에 실패했습니다.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: User) => {
    if (formState.isValid) {
      router.push("/profile");
      update(data);
    }
  };

  useEffect(() => {
    if (isSuccess && userInfo) {
      reset(userInfo);
    } else if (isError) {
      toast({
        description: "개인정보를 불러오는데 실패했습니다.",
        variant: "destructive",
      });
    }
  }, [isSuccess, isError, userInfo, reset, toast]);

  return (
    <div className="container">
      <PageTitle className="mb-4">개인정보 수정</PageTitle>
      <Card>
        <CardHeader>
          <CardDescription>
            개인 정보와 계정 설정을 업데이트하세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                disabled
                required
                {...register("email", { required: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                required
                {...register("name", {
                  required: true,
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName">회사 이름</Label>
              <Input
                id="company"
                required
                {...register("company", { required: true })}
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={!formState.isValid || isPending}
            className="w-full"
          >
            {isPending ? <Spinner className="mr-2" /> : null}
            변경사항 저장
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
