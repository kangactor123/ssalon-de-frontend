"use client";

import { Progress } from "@/shared/ui/progress";
import { useTargetTotalSales } from "@/queries/dashboard";
import { TargetTotalSales } from "@/queries/dashboard/type";
import { formatDate } from "@/shared/utils/dayjs";
import { YEAR_MONTH } from "@/shared/constants/dayjs-format";
import dayjs from "dayjs";
import useDateStore from "@/zustand/date";
import { memo } from "react";

const initialData: TargetTotalSales = {
  targetSales: 0,
  totalSales: 0,
};

function TargetTotalSalesWidget() {
  const date = useDateStore((state) => state.date);
  const { data: targetTotalSales = initialData } = useTargetTotalSales(
    formatDate({ date: dayjs(date), format: YEAR_MONTH })
  );

  const { targetSales, totalSales } = targetTotalSales;
  const percentage = (totalSales / targetSales) * 100;
  const difference = targetSales - totalSales;

  return (
    <div className="space-y-4">
      <Progress value={percentage} className="w-full" />
      <div className="flex flex-col gap-2 text-sm">
        <div className="flex gap-1 items-center">
          현재 매출:
          <span className="font-bold text-lg text-slate-800">
            {totalSales.toLocaleString()}원
          </span>
        </div>
        <div className="flex gap-1 items-center">
          목표 매출:
          <span className="font-bold text-lg text-slate-800">
            {targetSales.toLocaleString()}원
          </span>
        </div>
      </div>
      <div className="text-center">
        {difference > 0 ? (
          <p className="text-red-500">
            목표까지 {difference.toLocaleString()}원 부족..
          </p>
        ) : (
          <p className="text-green-500">
            목표를 {Math.abs(difference).toLocaleString()}원 초과 달성!
          </p>
        )}
      </div>
    </div>
  );
}

export default memo(TargetTotalSalesWidget);
