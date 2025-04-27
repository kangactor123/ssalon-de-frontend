import { Home, List, Settings, User } from "lucide-react";
import type { Route } from "../types/route";
import { PATH } from "./path";

export const routes: Route[] = [
  { path: PATH.DASHBOARD, icon: Home, label: "대시보드" },
  { path: PATH.SALES, icon: List, label: "매출 목록" },
  { path: PATH.MANAGEMENT, icon: Settings, label: "관리" },
  { path: PATH.PROFILE, icon: User, label: "내 정보 관리" },
];
