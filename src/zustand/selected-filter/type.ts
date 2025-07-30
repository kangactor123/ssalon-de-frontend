import { Sale } from "@/queries/sales/type";

export type Filter = { id: string; name: string; type: string };

export interface States {
  selectedFilters: Filter[];
}

export interface Actions {
  toggleFilter: (filter: Filter) => void;
  getFilteredSales: (sales: Sale[], selectedFilters: Filter[]) => Sale[];
}

export interface Store extends States, Actions {}
