"use client";

import { memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Scissors, LogOut } from "lucide-react";
import useUserStore from "@/zustand/user";
import { routes } from "@/shared/constants/routes";
import { APP_NAME } from "@/shared/constants/app";
import { useLogout } from "@/shared/hooks/use-logout";
import { useStore } from "@/shared/hooks/use-store";
import { useInitCustomBadge } from "@/shared/hooks/use-init-custom-badge";
import { useInitUserInfo } from "@/shared/hooks/use-init-user-info";
import LoadingButton from "@/shared/ui/loading-button";
import { Calendar } from "@/shared/ui/calendar";
import { useCalendar } from "@/shared/hooks/use-calendar";
import UserProfile from "./user-profile";

function Sidebar() {
  const user = useStore(useUserStore, (state) => state.user);
  const pathname = usePathname();
  const { onLogout, isLogoutIdle } = useLogout();
  const { selectedDate, onChangeDate, today } = useCalendar();
  const isActive = (path: string) => pathname === path;

  const { isLoading, enabledInitialize } = useInitUserInfo();
  useInitCustomBadge();

  return (
    <aside className="hidden w-64 h-screen border border-gray-200 shadow-lg md:flex md:flex-col bg-gray-50">
      <div className="flex-none p-6 border-b border-gray-200">
        <Link href="/" className="flex items-center space-x-2">
          <Scissors className="w-8 h-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-800">{APP_NAME}</span>
        </Link>
      </div>
      <div className="flex-none p-4 border-b border-gray-200 min-h-[77px]">
        <UserProfile
          name={user?.name}
          email={user?.email}
          isLoading={enabledInitialize || isLoading}
        />
      </div>
      <nav className="flex-grow p-4 overflow-auto scrollbar-hidden">
        <ul className="space-y-2">
          {routes.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item?.icon && <item.icon size={20} />}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex-none p-4 border-t border-gray-200">
        <LoadingButton
          isLoading={!isLogoutIdle}
          variant="outline"
          className="flex items-center justify-center w-full space-x-2"
          onClick={() => onLogout()}
        >
          <LogOut size={20} />
          <span>로그아웃</span>
        </LoadingButton>
      </div>
      <div className="min-h-[330px]">
        <Calendar
          className="border-gray-200"
          mode="single"
          selected={selectedDate}
          onSelect={onChangeDate}
          defaultMonth={selectedDate}
          disabled={{ after: today }}
        />
      </div>
    </aside>
  );
}

export default memo(Sidebar);
