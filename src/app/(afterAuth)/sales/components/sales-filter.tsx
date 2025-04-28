import { Badge } from "@/shared/ui/badge";
import { Filter } from "@/shared/types/filter";
import { cn } from "@/shared/utils/tailwind";
import useFilterTypes from "@/shared/hooks/use-filter-types";
import { useMemo } from "react";
import { BADGE_TYPE } from "@/shared/constants/badge-type";
import { Skeleton } from "@/shared/ui/skeleton";

type SalesFilterProps = {
  selectedFilters: Filter[];
  onToggle: (filter: Filter) => void;
};

export function SalesFilter({ selectedFilters, onToggle }: SalesFilterProps) {
  const { isLoading, visitTypes, paymentTypes, serviceTypes, genders } =
    useFilterTypes();

  const visitTypeFilters = useMemo(() => {
    return visitTypes.map((visitType) => ({
      ...visitType,
      type: BADGE_TYPE.visitType,
    }));
  }, [visitTypes]);

  const serviceTypeFilters = useMemo(() => {
    return serviceTypes.map((serviceType) => ({
      ...serviceType,
      type: BADGE_TYPE.serviceType,
    }));
  }, [serviceTypes]);

  const paymentTypeFilters = useMemo(() => {
    return paymentTypes.map((paymentType) => ({
      ...paymentType,
      type: BADGE_TYPE.paymentType,
    }));
  }, [paymentTypes]);

  const genderFilters = useMemo(() => {
    return genders.map((gender) => ({ ...gender, type: BADGE_TYPE.gender }));
  }, [genders]);

  const filterList = [
    ...visitTypeFilters,
    ...serviceTypeFilters,
    ...paymentTypeFilters,
    ...genderFilters,
  ] as Filter[];

  if (isLoading) {
    const mockFilters = Array.from({ length: 5 }, (_, index) => index + 1);
    return (
      <div className="flex gap-1">
        {mockFilters.map((value) => (
          <BadgeSkeleton key={`badge${value}`} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex md:flex-wrap md:mt-[24px] h-auto py-[6px] gap-1 box-border overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-hidden">
      {filterList.map(({ id, name, type }) => {
        const isSelected = selectedFilters.some((filter) => filter.id === id);
        return (
          <Badge
            key={id}
            onClick={() => onToggle({ id, type, name })}
            variant={isSelected ? "default" : "outline"}
            className={cn("cursor-pointer select-none")}
          >
            {name}
          </Badge>
        );
      })}
    </div>
  );
}

const BadgeSkeleton = () => {
  return <Skeleton className="w-[80px] h-[22px]" />;
};
