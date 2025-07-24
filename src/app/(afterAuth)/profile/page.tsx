import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardFooter,
} from "@/shared/ui/card";
import PageTitle from "@/shared/ui/page-title";
import Link from "next/link";
import Profile from "./components/profile";
import { getQueryClient } from "@/shared/utils/react-query";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { serverFetch } from "@/shared/utils/server-fetch";
import { User } from "@/queries/auth/type";
import { getUserQueryOptions } from "@/queries/auth";

export default async function ProfilePage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    ...getUserQueryOptions(),
    queryFn: () => serverFetch<User>("/auth/info"),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="container">
        <PageTitle className="mb-4">개인정보 확인</PageTitle>
        <Card>
          <CardHeader>
            <CardDescription>귀하의 개인정보를 확인하세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Profile />
          </CardContent>
          <CardFooter>
            <Link className="w-full" href="/profile/edit">
              <Button className="w-full">개인정보 수정</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </HydrationBoundary>
  );
}
