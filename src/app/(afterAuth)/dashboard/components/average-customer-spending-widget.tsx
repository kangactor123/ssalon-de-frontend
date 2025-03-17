"use client";

import { useAverageCustomerSpending } from "@/queries/dashboard";
import { YEAR_MONTH } from "@/shared/constants/dayjs-format";
import { formatDate } from "@/shared/utils/dayjs";
import { TrendingUp, TrendingDown } from "lucide-react";

const initialData = {
  currentMonth: 0,
  previousMonth: 0,
};

export function AverageCustomerSpendingWidget() {
  const { data = initialData } = useAverageCustomerSpending(
    formatDate({ format: YEAR_MONTH })
  );

  const currentMonth = data.currentMonth ?? initialData.currentMonth;
  const previousMonth = data.previousMonth ?? initialData.previousMonth;

  const percentageChange =
    ((currentMonth - previousMonth) / previousMonth) * 100;

  const isPercentageValid = percentageChange !== Infinity;

  return (
    <div className="space-y-4">
      <div>
        <div className="text-3xl font-bold text-gray-900">
          {currentMonth.toLocaleString()}원
        </div>
        <p className="flex items-center justify-between mt-1 text-sm text-gray-500">
          이번 달 고객 평균 지출액
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
          {isPercentageValid && (
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
          )}
        </div>
      </div>
    </div>
  );
}
