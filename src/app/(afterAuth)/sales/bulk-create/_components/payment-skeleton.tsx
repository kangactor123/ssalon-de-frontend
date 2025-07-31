import { Skeleton } from "@/shared/ui/skeleton";

const PaymentSkeleton = () => {
  return (
    <div className="h-6 flex items-center gap-2">
      <Skeleton className="w-6 h-6" />
      <Skeleton className="w-20 h-6" />
      <Skeleton className="w-[120px] h-8" />
    </div>
  );
};

export default PaymentSkeleton;
