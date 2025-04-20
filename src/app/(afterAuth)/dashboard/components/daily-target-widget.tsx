"use client";

import { useTargetTotalSales } from "@/queries/dashboard";
import { cn } from "@/shared/utils/tailwind";
import dayjs from "dayjs";
import { ArrowUpCircle, Calendar, Flag } from "lucide-react";
import { useRouter } from "next/navigation";
import EmptyWidget from "./empty-widget";
import { formatDate } from "@/shared/utils/dayjs";
import { YEAR_MONTH } from "@/shared/constants/dayjs-format";
import useDateStore from "@/zustand/date";
import { memo } from "react";

const initialData = {
  targetSales: 0,
  totalSales: 0,
};

function DailyTargetWidget() {
  const router = useRouter();
  const date = useDateStore((state) => state.date);
  const { data: targetTotalSales = initialData } = useTargetTotalSales(
    formatDate({ date: dayjs(date), format: YEAR_MONTH })
  );

  const daysInMonth = dayjs(date).daysInMonth();
  const selectedDate = dayjs(date).date();
  const isNotSettingTarget = targetTotalSales.targetSales === 0;
  const remainingDaysInMonth = daysInMonth - selectedDate;
  const isOver = targetTotalSales.totalSales > targetTotalSales.targetSales;
  const overAmount = targetTotalSales.totalSales - targetTotalSales.targetSales;
  const targetTotalSalesPerDay = Math.ceil(
    (targetTotalSales.targetSales - targetTotalSales.totalSales) /
      remainingDaysInMonth
  );

  const handleClickRoute = () => {
    router.push("/management");
  };

  if (isNotSettingTarget) {
    return (
      <EmptyWidget
        onClick={handleClickRoute}
        buttonLabel="설정하기"
        description="목표를 설정해주세요."
      />
    );
  }
  return (
    <div className="flex flex-col gap-6">
      <div>
        {!!remainingDaysInMonth && (
          <>
            <p
              className={cn(
                "text-3xl font-bold mb-2",
                isOver ? "text-blue-600" : "text-gray-900"
              )}
            >
              {isOver
                ? overAmount.toLocaleString()
                : targetTotalSalesPerDay.toLocaleString()}
              원
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {isOver ? "목표에 도달했습니다!" : "일일 필요 매출액"}
            </p>
          </>
        )}
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex items-center text-sm">
          <ArrowUpCircle className="w-4 h-4 mr-2 text-blue-500" />
          <span className="text-gray-600">현재 총 매출:</span>
          <span className="ml-auto font-medium text-gray-900">
            {targetTotalSales.totalSales.toLocaleString()}원
          </span>
        </div>
        <div className="flex items-center text-sm">
          <Calendar className="w-4 h-4 mr-2 text-green-500" />
          <span className="text-gray-600">남은 기간:</span>
          <span className="ml-auto font-medium text-gray-900">
            {remainingDaysInMonth}일
          </span>
        </div>
        <div className="flex items-center text-sm">
          <Flag className="w-4 h-4 mr-2 text-red-500" />
          <span className="text-gray-600">목표 금액:</span>
          <span className="ml-auto font-medium text-gray-900">
            {targetTotalSales?.targetSales.toLocaleString()}원
          </span>
        </div>
      </div>
    </div>
  );
}

export default memo(DailyTargetWidget);
