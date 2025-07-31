"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

import forma_logo from "@/assets/images/logo/forma.png";

export function Logo() {
  const router = useRouter();
  return (
    <div className="flex items-center" onClick={() => router.push("/")}>
      <Image src={forma_logo} alt="forma_logo" width="120" height="30" />
    </div>
  );
}
