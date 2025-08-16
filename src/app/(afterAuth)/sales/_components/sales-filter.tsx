import useSelectedFiltersStore from "@/zustand/selected-filter";

import useFilterTypes from "@/shared/hooks/use-filter-types";
import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/utils/tailwind";
import { Skeleton } from "@/shared/ui/skeleton";

export function SalesFilter() {
  const { isLoading, visitTypes, paymentTypes, serviceTypes, genders } =
    useFilterTypes();

  const filters = [...genders, ...visitTypes, ...serviceTypes, ...paymentTypes];
  const selectedFilters = useSelectedFiltersStore(
    (state) => state.selectedFilters
  );
  const handleToggleFilter = useSelectedFiltersStore(
    (state) => state.toggleFilter
  );

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
    <div className="flex md:flex-wrap  h-auto py-[6px] gap-1 box-border overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-hidden">
      {filters.map(({ id, name, type }) => {
        const isSelected = selectedFilters.some((filter) => filter.id === id);
        return (
          <Badge
            key={id}
            onClick={() => handleToggleFilter({ id, type, name })}
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
