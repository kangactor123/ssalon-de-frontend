"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Scissors } from "lucide-react";
import { Sheet, SheetContent } from "@/shared/ui/sheet";
import { DialogTitle } from "@radix-ui/react-dialog";

import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { useLogout } from "@/shared/hooks/use-logout";
import { routes } from "@/shared/constants/routes";
import useUserStore from "@/zustand/user";
import Calendar from "./calendar";
import { MobileHeader } from "./mobile-header";
import { APP_NAME } from "@/shared/constants/app";
import { useInitCustomBadge } from "@/shared/hooks/use-init-custom-badge";
import Spinner from "@/shared/ui/spinner";
import { useInitUserInfo } from "@/shared/hooks/use-init-user-info";
import LoadingButton from "@/shared/ui/loading-button";

export function MobileMenu() {
  const pathname = usePathname();
  const { user } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);
  const { onLogout, isLogoutIdle } = useLogout();
  const { isLoading, enabledInitialize } = useInitUserInfo();

  const isActive = (path: string) => pathname === path;

  useInitCustomBadge();

  return (
    <>
      <MobileHeader onMenuToggle={() => setIsOpen(true)} />
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          side="left"
          className="w-[300px] sm:w-[400px] overflow-y-auto"
        >
          <VisuallyHidden.Root>
            <DialogTitle>{APP_NAME}</DialogTitle>
          </VisuallyHidden.Root>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between py-4 border-b">
              <Link
                href="/"
                className="flex items-center space-x-2"
                onClick={() => setIsOpen(false)}
              >
                <Scissors className="w-8 h-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-800">
                  {APP_NAME}
                </span>
              </Link>
            </div>
            <div className="flex items-center px-6 py-4 space-x-4 border-b">
              {enabledInitialize || isLoading ? (
                <div className="flex items-center justify-center w-full h-full">
                  <Spinner />
                </div>
              ) : (
                <div>
                  <p className="font-medium text-gray-700">{user?.name}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              )}
            </div>
            <nav className="flex-grow py-6 scrollbar-hidden">
              <ul className="space-y-2">
                {routes.map((item) => (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      className={`flex items-center space-x-3 px-6 py-3  text-gray-700 hover:bg-gray-100 ${
                        isActive(item.path) ? "bg-blue-100 text-blue-600" : ""
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item?.icon && <item.icon size={20} />}
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="border-t">
              <Calendar />
            </div>
            <div className="px-6 py-4 border-t">
              <LoadingButton
                isLoading={!isLogoutIdle}
                variant="outline"
                className="flex items-center justify-center w-full space-x-2"
                onClick={() => {
                  onLogout();
                }}
              >
                <LogOut size={20} />
                <span>로그아웃</span>
              </LoadingButton>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
