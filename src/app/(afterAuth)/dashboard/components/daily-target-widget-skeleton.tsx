"use client";

import { ArrowUpCircle, Calendar, Flag } from "lucide-react";

import { Skeleton } from "@/shared/ui/skeleton";

function DailyTargetWidgetSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <Skeleton className="w-[100%] h-[40px]" />
        <Skeleton className="w-[120px] h-[15px]" />
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex items-center text-sm">
          <ArrowUpCircle className="w-4 h-4 mr-2 text-blue-500" />
          <span className="text-gray-600">현재 총 매출:</span>
          <Skeleton className="ml-auto w-[80px] h-[20px]" />
        </div>
        <div className="flex items-center text-sm">
          <Calendar className="w-4 h-4 mr-2 text-green-500" />
          <span className="text-gray-600">남은 기간:</span>
          <Skeleton className="ml-auto w-[80px] h-[20px]" />
        </div>
        <div className="flex items-center text-sm">
          <Flag className="w-4 h-4 mr-2 text-red-500" />
          <span className="text-gray-600">목표 금액:</span>
          <Skeleton className="ml-auto w-[80px] h-[20px]" />
        </div>
      </div>
    </div>
  );
}

export default DailyTargetWidgetSkeleton;
