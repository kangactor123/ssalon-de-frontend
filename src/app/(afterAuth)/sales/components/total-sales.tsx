"use client";

import { useSales, useTotalAmount } from "@/queries/sales";
import useDateStore from "@/zustand/date";
import { useMemo } from "react";
import { formatDate } from "@/shared/utils/dayjs";
import { YEAR_MONTH_DAY_TIME } from "@/shared/constants/dayjs-format";
import { Button } from "@/shared/ui/button";
import { LucideRotateCw } from "lucide-react";
import TotalSalesSkeleton from "./total-sales-skeleton";

export function TotalSales() {
  const { date } = useDateStore();
  const { data = [] } = useSales(
    { date: formatDate({ date }) },
    { enabled: !!date }
  );

  const {
    data: amount = 0,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useTotalAmount(formatDate({ date, format: YEAR_MONTH_DAY_TIME }), {
    retry: 3,
  });

  const loading = isLoading || isFetching;
  const totalCount = useMemo(() => data.length, [data]);

  if (loading) {
    return <TotalSalesSkeleton />;
  }

  if (isError) {
    return (
      <div className="text-gray-500 text-sm flex items-center">
        <Button
          size="sm"
          variant="link"
          className="p-0 mr-2"
          onClick={() => refetch()}
        >
          <LucideRotateCw className="text-gray-500" />
        </Button>
        새로고침을 통해 다시 호출해주세요.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:flex-row md:gap-0">
      <div className="flex items-center gap-2 tracking-wider">
        <span className="text-sm font-medium text-gray-600">총 매출</span>
        <p className="text-2xl font-bold">{amount.toLocaleString()}원</p>
      </div>
      <div className="hidden md:block border border-[bg-gray-200] m-2 mx-4" />
      <div className="flex items-center gap-2 tracking-wider">
        <span className="text-sm font-medium text-gray-600">예약 건수</span>
        <p className="text-2xl font-bold">{totalCount.toLocaleString()}건</p>
      </div>
    </div>
  );
}
