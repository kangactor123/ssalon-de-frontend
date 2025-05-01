"use client";

import { Scissors } from "lucide-react";
import { useRouter } from "next/navigation";
import { APP_NAME } from "@/shared/constants/app";

export function Logo() {
  const router = useRouter();
  return (
    <div className="flex items-center" onClick={() => router.push("/")}>
      <Scissors className="w-8 h-8 text-blue-600" />
      <span className="ml-2 text-xl font-bold text-gray-800">{APP_NAME}</span>
    </div>
  );
}
