import { Card, CardContent } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";

const SalesItemSkeleton = () => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-8">
          <Skeleton className="w-[100px] h-[20px]" />
          <Skeleton className="w-[100px] h-[20px]" />
        </div>
        <Skeleton className="w-full h-[20px] mb-4" />
        <Skeleton className="w-full h-[20px]" />
      </CardContent>
    </Card>
  );
};

export default SalesItemSkeleton;
