import { Skeleton } from "@/shared/ui/skeleton";

const BadgeSkeleton = () => {
  return <Skeleton className="w-[80px] h-[22px]" />;
};

const SalesFilterSkeleton: React.FC = () => {
  const mockFilters = Array.from({ length: 5 }, (_, index) => index + 1);
  return (
    <div className="flex md:flex-wrap md:mt-[24px] h-auto py-[6px] gap-1 box-border">
      {mockFilters.map((value) => (
        <BadgeSkeleton key={`badge${value}`} />
      ))}
    </div>
  );
};

export default SalesFilterSkeleton;
