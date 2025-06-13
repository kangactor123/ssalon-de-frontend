"use client";

import { Skeleton } from "@/shared/ui/skeleton";

function AverageCustomerSpendingWidgetSkeleton() {
  return (
    <div className="space-y-4">
      <div>
        <Skeleton className="w-[120px] h-[40px]" />
        <div className="flex items-center mt-1 text-sm text-gray-500">
          <Skeleton className="w-[18px] h-[18px]" />월 고객 평균 지출액
        </div>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
        <div>
          <Skeleton className="w-[80px] h-[24px]" />
          <p className="text-sm text-gray-500">지난 달 고객 평균 지출액</p>
        </div>
        <div className="flex items-center">
          <Skeleton />
        </div>
      </div>
    </div>
  );
}

export default AverageCustomerSpendingWidgetSkeleton;
