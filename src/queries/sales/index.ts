import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { CreateSaleDto, GetSalesParams, Sale, UpdateSaleDto } from "./type";
import { KEYS } from "@/shared/constants/query-keys";
import {
  createSale,
  deleteSale,
  getSale,
  getSales,
  getTotalAmount,
  updateSale,
} from "./api";
import { MutationOptions } from "@/shared/types/query";

export const useSales = (
  params: GetSalesParams,
  options?: Omit<UseQueryOptions<Sale[]>, "queryKey" | "queryFn">
) => {
  return useQuery<Sale[]>({
    ...options,
    queryKey: [KEYS.sales.list, params.date],
    queryFn: () => getSales(params),
  });
};

export const useSale = (
  saleId: string,
  options?: Omit<UseQueryOptions<Sale>, "queryKey" | "queryFn">
) => {
  return useQuery<Sale>({
    ...options,
    queryKey: [KEYS.sales.list, saleId],
    queryFn: () => getSale(saleId),
  });
};

export const useTotalAmount = (
  date: string,
  options?: Omit<UseQueryOptions<number>, "queryKey" | "queryFn">
) => {
  return useQuery<number>({
    ...options,
    queryKey: [KEYS.sales.list, KEYS.sales.totalAmount, date],
    queryFn: () => getTotalAmount(date),
  });
};

export const useCreateSale = (options?: MutationOptions<CreateSaleDto>) => {
  return useMutation({
    ...options,
    mutationFn: createSale,
  });
};

export const useUpdateSale = (options?: MutationOptions<UpdateSaleDto>) => {
  return useMutation({
    ...options,
    mutationFn: updateSale,
  });
};

export const useDeleteSale = (options?: MutationOptions<string>) => {
  return useMutation({
    ...options,
    mutationFn: deleteSale,
  });
};
