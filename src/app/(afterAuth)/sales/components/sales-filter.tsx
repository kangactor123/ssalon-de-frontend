"use client";

import useSelectedFiltersStore from "@/zustand/selected-filter";

import useFilterTypes from "@/shared/hooks/use-filter-types";
import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/utils/tailwind";

export function SalesFilter() {
  const { visitTypes, paymentTypes, serviceTypes, genders } = useFilterTypes();

  const filters = [...genders, ...visitTypes, ...serviceTypes, ...paymentTypes];
  const selectedFilters = useSelectedFiltersStore(
    (state) => state.selectedFilters
  );
  const handleToggleFilter = useSelectedFiltersStore(
    (state) => state.toggleFilter
  );

  return (
    <div className="flex md:flex-wrap md:mt-[24px] h-auto py-[6px] gap-1 box-border overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-hidden">
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
