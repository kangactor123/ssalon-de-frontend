"use client";

import Spinner from "@/shared/ui/spinner";
import { useMonthlyTotalSales } from "@/queries/dashboard";
import { formatDate } from "@/shared/utils/dayjs";
import { YEAR_MONTH } from "@/shared/constants/dayjs-format";
import dayjs from "dayjs";
import useDateStore from "@/zustand/date";

export function TotalSalesWidget() {
  const date = useDateStore((state) => state.date);
  const { data: monthlyTotalSales, isFetching } = useMonthlyTotalSales(
    formatDate({ date: dayjs(date), format: YEAR_MONTH })
  );

  if (isFetching) {
    return (
      <div className="flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="h-[100%] space-y-4 max-h-[450px] overflow-auto scrollbar-hidden">
      <div className="text-2xl font-bold">
        {monthlyTotalSales?.amount.toLocaleString()}원
      </div>
      <div className="space-y-2">
        {monthlyTotalSales?.payments.map((item, idx) => (
          <div key={`${item.type}${idx}`} className="flex justify-between">
            <span>{item.type}</span>
            <span>{item.amount.toLocaleString()}원</span>
          </div>
        ))}
      </div>
    </div>
  );
}
