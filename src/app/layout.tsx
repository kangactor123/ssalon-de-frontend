import type { Metadata } from "next";
import QueryProvider from "@/shared/providers/react-query";
import { Toaster } from "@/shared/ui/toaster";

import localFont from "next/font/local";
import "./globals.css";
import { APP_DESCRIPTION, APP_NAME } from "@/shared/constants/app";
import { Suspense } from "react";
import GlobalLoading from "./loading";
import SessionProvider from "@/shared/providers/session-provider";

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
          <Suspense fallback={<GlobalLoading />}>
            <QueryProvider>{children}</QueryProvider>
          </Suspense>
        </SessionProvider>
      </body>
    </html>
  );
}
