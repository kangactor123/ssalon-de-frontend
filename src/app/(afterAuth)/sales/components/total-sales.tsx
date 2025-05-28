"use client";

import { useSales } from "@/queries/sales";
import useDateStore from "@/zustand/date";
import { useMemo } from "react";
import { formatDate } from "@/shared/utils/dayjs";
import { Button } from "@/shared/ui/button";
import { LucideRotateCw } from "lucide-react";
import useSelectedFiltersStore from "@/zustand/selected-filter";

export function TotalSales() {
  const selectedFilter = useSelectedFiltersStore(
    (state) => state.selectedFilters
  );
  const getFilteredSales = useSelectedFiltersStore(
    (state) => state.getFilteredSales
  );
  const { date } = useDateStore();
  const {
    data: sales = [],
    isError,
    refetch,
  } = useSales({ date: formatDate({ date }) }, { enabled: !!date });

  const filteredSales = useMemo(
    () => getFilteredSales(sales),
    [sales, selectedFilter, getFilteredSales]
  );

  const totalCount = filteredSales.length;
  const totalAmount = filteredSales.reduce((acc, { amount }) => {
    return acc + +amount;
  }, 0);

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
        <p className="text-2xl font-bold">{totalAmount.toLocaleString()}원</p>
      </div>
      <div className="hidden md:block border border-[bg-gray-200] m-2 mx-4" />
      <div className="flex items-center gap-2 tracking-wider">
        <span className="text-sm font-medium text-gray-600">예약 건수</span>
        <p className="text-2xl font-bold">{totalCount.toLocaleString()}건</p>
      </div>
    </div>
  );
}
