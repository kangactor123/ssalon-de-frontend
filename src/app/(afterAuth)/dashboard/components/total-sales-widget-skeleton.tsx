import { Skeleton } from "@/shared/ui/skeleton";

function TotalSalesWidgetSkeleton() {
  const mockFilters = Array.from({ length: 3 }, (_, index) => index + 1);

  return (
    <div className="space-y-4 max-h-[450px] overflow-auto scrollbar-hidden">
      <Skeleton className="w-[120px] h-[30px]" />
      <div className="h-[120px] space-y-4">
        {mockFilters.map((item) => (
          <Skeleton
            className="w-[100%] h-[30px]"
            key={`sales-skeleton-${item}`}
          />
        ))}
      </div>
    </div>
  );
}

export default TotalSalesWidgetSkeleton;
