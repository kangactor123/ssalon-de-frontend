"use client";

import { useTargetTotalSales } from "@/queries/dashboard";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import dayjs from "dayjs";
import { ArrowUpCircle, Calendar, Flag } from "lucide-react";
import { useRouter } from "next/navigation";

const initialData = {
  targetSales: 0,
  totalSales: 0,
};

export function DailyTargetWidget() {
  const router = useRouter();
  const { data: targetTotalSales = initialData } = useTargetTotalSales(
    dayjs().format("YYYY-MM")
  );

  const daysInMonth = dayjs().daysInMonth();
  const today = dayjs().date();
  const isNotSettingTarget = targetTotalSales.targetSales === 0;
  const remainingDaysInMonth = daysInMonth - today;
  const isOver = targetTotalSales.totalSales > targetTotalSales.targetSales;
  const overAmount = targetTotalSales.totalSales - targetTotalSales.targetSales;
  const targetTotalSalesPerDay =
    (targetTotalSales.targetSales - targetTotalSales.totalSales) / daysInMonth;

  const handleClickRoute = () => {
    router.push("/management");
  };
  return (
    <>
      {isNotSettingTarget ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-4">
          목표 매출을 설정해주세요.
          <Button onClick={handleClickRoute}>설정하기</Button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div>
            <div
              className={cn(
                "text-3xl font-bold mb-2",
                isOver ? "text-blue-600" : "text-gray-900"
              )}
            >
              {isOver
                ? overAmount.toLocaleString()
                : targetTotalSalesPerDay.toLocaleString()}
              원
            </div>
            <p className="mt-1 text-sm text-gray-500">
              {isOver ? "목표에 도달했습니다!" : "일일 필요 매출액"}
            </p>
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
      )}
    </>
  );
}
