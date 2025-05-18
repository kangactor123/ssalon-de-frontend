import { create } from "zustand";
import { Store } from "./type";
import { BADGE_TYPE } from "@/shared/constants/badge-type";

export const initialSelectedFilters = [];

const useSelectedFiltersStore = create<Store>((set, get) => ({
  selectedFilters: initialSelectedFilters,
  toggleFilter: (filter) => {
    const previousFilters = get().selectedFilters;

    const isFilterSelected = previousFilters.some(({ id }) => id === filter.id);
    const newFilters = isFilterSelected
      ? previousFilters.filter(({ id }) => id !== filter.id)
      : [...previousFilters, filter];

    set({ selectedFilters: newFilters });
  },
  getFilteredSales: (sales) => {
    const selectedFilters = get().selectedFilters;

    const filteredSales = sales.filter((sale) => {
      const selectedVisitTypes = selectedFilters
        .filter((filter) => filter.type === BADGE_TYPE.visitType)
        .map(({ id }) => id);

      // 방문 유형이 있다면 필터링
      if (selectedVisitTypes.length > 0) {
        return sale.visitTypes.some((visitType) =>
          selectedVisitTypes.includes(visitType.id)
        );
      }

      const selectedServices = selectedFilters
        .filter((filter) => filter.type === BADGE_TYPE.serviceType)
        .map(({ id }) => id);

      // 서비스 타입이 있다면 필터링
      if (selectedServices.length > 0) {
        return sale.services.some((service) =>
          selectedServices.includes(service.id)
        );
      }

      const selectedGenders = selectedFilters
        .filter((filter) => filter.type === BADGE_TYPE.gender)
        .map(({ id }) => id);

      // 성별이 있다면 필터링
      if (selectedGenders.length > 0) {
        return selectedGenders.includes(sale.gender);
      }

      const selectedPaymentTypes = selectedFilters
        .filter((filter) => filter.type === BADGE_TYPE.paymentType)
        .map(({ id }) => id);

      // 결제 유형이 있다면 필터링
      if (selectedPaymentTypes.length > 0) {
        return selectedFilters.some(({ id }) =>
          sale.payments.some(({ typeId }) => typeId === id)
        );
      }

      return true;
    });

    return filteredSales;
  },
}));

export default useSelectedFiltersStore;
