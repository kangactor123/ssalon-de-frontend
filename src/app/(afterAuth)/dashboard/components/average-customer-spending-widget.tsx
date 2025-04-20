"use client";

import { useAverageCustomerSpending } from "@/queries/dashboard";
import { YEAR_MONTH } from "@/shared/constants/dayjs-format";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip";
import { formatDate } from "@/shared/utils/dayjs";
import useDateStore from "@/zustand/date";
import dayjs from "dayjs";
import { TrendingUp, TrendingDown, TriangleAlertIcon } from "lucide-react";
import { memo } from "react";

const initialData = {
  currentMonth: 0,
  previousMonth: 0,
};

function AverageCustomerSpendingWidget() {
  const date = useDateStore((state) => state.date);

  const getMonth = useDateStore((state) => state.getMonth);
  const selectedMonth = getMonth(date);
  const { data = initialData } = useAverageCustomerSpending(
    formatDate({ date: dayjs(date), format: YEAR_MONTH })
  );

  const currentMonth = data.currentMonth ?? initialData.currentMonth;
  const previousMonth = data.previousMonth ?? initialData.previousMonth;

  const percentageChange =
    ((currentMonth - previousMonth) / previousMonth) * 100;

  const isPercentageValid =
    percentageChange !== Infinity && !isNaN(percentageChange);

  return (
    <div className="space-y-4">
      <div>
        <div className="text-3xl font-bold text-gray-900">
          {currentMonth.toLocaleString()}원
        </div>
        <p className="flex items-center justify-between mt-1 text-sm text-gray-500">
          {selectedMonth}월 고객 평균 지출액
        </p>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
        <div>
          <div className="mb-1 text-base font-semibold text-gray-700">
            {previousMonth.toLocaleString()}원
          </div>
          <p className="text-sm text-gray-500">지난 달 고객 평균 지출액</p>
        </div>
        <div className="flex items-center">
          {isPercentageValid ? (
            <>
              {percentageChange >= 0 ? (
                <>
                  <TrendingUp className="w-5 h-5 mr-1 text-green-500" />
                  <span className="text-xs font-medium text-green-600">
                    {Math.abs(percentageChange).toFixed()}% 증가
                  </span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-5 h-5 mr-1 text-red-500" />
                  <span className="text-xs font-medium text-red-600">
                    {Math.abs(percentageChange).toFixed()}% 감소
                  </span>
                </>
              )}
            </>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipContent>
                  데이터가 정상적인지 확인해주세요.
                </TooltipContent>
                <TooltipTrigger>
                  <TriangleAlertIcon className="w-5 h-5 text-red-300" />
                </TooltipTrigger>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(AverageCustomerSpendingWidget);
