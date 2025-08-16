import { Skeleton } from "@/shared/ui/skeleton";

const TotalSalesSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:gap-0">
      <Skeleton className="w-[120px] h-[30px]" />
      <div className="hidden md:block border border-[bg-gray-200] m-2 mx-4" />
      <div className="flex items-center gap-2 tracking-wider">
        <Skeleton className="w-[120px] h-[30px]" />
      </div>
    </div>
  );
};

export default TotalSalesSkeleton;
