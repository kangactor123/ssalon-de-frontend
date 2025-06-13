import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import {
  AverageCustomerSpending,
  DailySale,
  DailySaleAmountCount,
  GenderRatio,
  MonthlyTotalSales,
  TargetTotalSales,
  TotalCount,
  VisitTypesRatio,
} from "./type";
import {
  getDailySalesAmountCount,
  getGenderRatio,
  getMonthlyAverageSales,
  getMonthlySales,
  getMonthlyTotalSales,
  getMonthTotalCount,
  getTargetTotalSales,
  getVisitTypesRatio,
} from "./api";
import { KEYS } from "@/shared/constants/query-keys";
import { DASHBOARD_STALE_TIME } from "@/shared/constants/app";

export const useMonthlySales = (
  targetMonth: string,
  options?: Omit<UseQueryOptions<DailySale[]>, "queryKey" | "queryFn">
) => {
  return useQuery<DailySale[]>({
    ...options,
    staleTime: DASHBOARD_STALE_TIME,
    queryKey: [KEYS.dashboard.widget.monthlySales, targetMonth],
    queryFn: () => getMonthlySales(targetMonth),
  });
};

export const useMonthlyTotalSales = (
  targetMonth: string,
  options?: Omit<UseQueryOptions<MonthlyTotalSales>, "queryKey" | "queryFn">
) => {
  return useQuery<MonthlyTotalSales>({
    ...options,
    staleTime: DASHBOARD_STALE_TIME,
    queryKey: [KEYS.dashboard.widget.monthlyTotalSales, targetMonth],
    queryFn: () => getMonthlyTotalSales(targetMonth),
  });
};

export const useTargetTotalSales = (
  targetMonth: string,
  options?: Omit<UseQueryOptions<TargetTotalSales>, "queryKey" | "queryFn">
) => {
  return useQuery<TargetTotalSales>({
    ...options,
    staleTime: DASHBOARD_STALE_TIME,
    queryKey: [KEYS.dashboard.widget.targetTotalSales, targetMonth],
    queryFn: () => getTargetTotalSales(targetMonth),
  });
};

export const useDailySalesAmountCount = (
  targetMonth: string,
  options?: Omit<
    UseQueryOptions<DailySaleAmountCount[]>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<DailySaleAmountCount[]>({
    ...options,
    staleTime: DASHBOARD_STALE_TIME,
    queryKey: [KEYS.dashboard.widget.dailySalesAmountCount, targetMonth],
    queryFn: () => getDailySalesAmountCount(targetMonth),
  });
};

export const useGenderRatio = (
  targetMonth: string,
  options?: Omit<UseQueryOptions<GenderRatio>, "queryKey" | "queryFn">
) => {
  return useQuery<GenderRatio>({
    ...options,
    staleTime: DASHBOARD_STALE_TIME,
    queryKey: [KEYS.dashboard.widget.genderRatio, targetMonth],
    queryFn: () => getGenderRatio(targetMonth),
  });
};

export const useVisitTypesRatio = (
  targetMonth: string,
  options?: Omit<UseQueryOptions<VisitTypesRatio>, "queryKey" | "queryFn">
) => {
  return useQuery<VisitTypesRatio>({
    ...options,
    staleTime: DASHBOARD_STALE_TIME,
    queryKey: [KEYS.dashboard.widget.visitTypesRatio, targetMonth],
    queryFn: () => getVisitTypesRatio(targetMonth),
  });
};

export const useAverageCustomerSpending = (
  targetMonth: string,
  options?: Omit<
    UseQueryOptions<AverageCustomerSpending>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<AverageCustomerSpending>({
    ...options,
    staleTime: DASHBOARD_STALE_TIME,
    queryKey: [KEYS.dashboard.widget.averageCustomerSpending, targetMonth],
    queryFn: () => getMonthlyAverageSales(targetMonth),
  });
};

export const useTotalCount = (
  targetMonth: string,
  options?: Omit<UseQueryOptions<TotalCount>, "queryKey" | "queryFn">
) => {
  return useQuery<TotalCount>({
    ...options,
    staleTime: DASHBOARD_STALE_TIME,
    queryKey: [KEYS.dashboard.widget.totalCount, targetMonth],
    queryFn: () => getMonthTotalCount(targetMonth),
  });
};
