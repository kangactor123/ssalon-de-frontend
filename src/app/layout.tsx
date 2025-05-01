import { Suspense } from "react";

import type { Metadata } from "next";
import dynamic from "next/dynamic";
import localFont from "next/font/local";

import QueryProvider from "@/shared/providers/react-query";
import { APP_DESCRIPTION, APP_NAME } from "@/shared/constants/app";
import SessionProvider from "@/shared/providers/session-provider";
import Loading from "@/shared/ui/loading";

import "./globals.css";

const Toaster = dynamic(() =>
  import("@/shared/ui/toaster").then((mod) => mod.Toaster)
);

const pretandard = localFont({
  src: "../assets/fonts/PretendardVariable.ttf",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${pretandard.className} bg-gray-100`}>
        <SessionProvider>
          <Toaster />
          <Suspense fallback={<Loading />}>
            <QueryProvider>{children}</QueryProvider>
          </Suspense>
        </SessionProvider>
      </body>
    </html>
  );
}
