import {
  queryOptions,
  useMutation,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import {
  CreatePaymentType,
  CreateServiceType,
  PaymentType,
  ServiceType,
  Setting,
  UpdatePaymentType,
  UpdateVisitTypeDto,
  VisitType,
} from "./type";
import {
  createPaymentType,
  createServiceType,
  createVisitType,
  deletePaymentType,
  deleteServiceType,
  deleteVisitType,
  editSettings,
  getPaymentTypes,
  getServiceTypes,
  getSettings,
  getVisitTypes,
  updatePaymentType,
  updateServiceType,
  updateVisitType,
} from "./api";
import {
  KEYS,
  PAYMENT_TYPES_KEY,
  SERVICE_TYPES_KEY,
  VISIT_TYPES_KEY,
} from "@/shared/constants/query-keys";
import { MutationOptions } from "@/shared/types/query";
import { FILTER_STALE_TIME } from "@/shared/constants/app";

export const useSettings = (
  options?: Omit<UseQueryOptions<Setting[]>, "queryKey" | "queryFn">
) => {
  return useQuery<Setting[]>({
    ...options,
    queryKey: [KEYS.settings.list],
    queryFn: getSettings,
  });
};

export const useEditSettings = (options?: MutationOptions<Setting[]>) => {
  return useMutation({
    ...options,
    mutationFn: editSettings,
  });
};

/** visit-types */
type VisitTypesQueryOptions<T = VisitType> = Omit<
  UseQueryOptions<T[]>,
  "queryKey"
>;
export const visitTypesQueryOptions = <T = VisitType>(
  options?: VisitTypesQueryOptions<T>
) =>
  queryOptions({
    ...options,
    staleTime: FILTER_STALE_TIME,
    queryKey: VISIT_TYPES_KEY,
    queryFn: getVisitTypes,
  });

export const useVisitTypes = <T = VisitType>(
  options?: Omit<UseQueryOptions<T[]>, "queryKey" | "queryFn">
) => {
  const queryOptions = visitTypesQueryOptions<T>(options);
  return useQuery<T[]>({
    ...queryOptions,
  });
};

export const useCreateVisitType = (options?: MutationOptions<string>) => {
  return useMutation({
    ...options,
    mutationFn: createVisitType,
  });
};

export const useUpdateVisitType = (
  options?: MutationOptions<UpdateVisitTypeDto>
) => {
  return useMutation({
    ...options,
    mutationFn: updateVisitType,
  });
};

export const useDeleteVisitType = (options?: MutationOptions<string>) => {
  return useMutation({
    ...options,
    mutationFn: deleteVisitType,
  });
};

/** service-types */
type ServiceTypesQueryOptions<T = ServiceType> = Omit<
  UseQueryOptions<T[]>,
  "queryKey"
>;
export const serviceTypesQueryOptions = <T = ServiceType>(
  options?: ServiceTypesQueryOptions<T>
) =>
  queryOptions({
    ...options,
    staleTime: FILTER_STALE_TIME,
    queryKey: SERVICE_TYPES_KEY,
    queryFn: getServiceTypes,
  });
export const useServiceTypes = <T = ServiceType>(
  options?: Omit<UseQueryOptions<T[]>, "queryKey" | "queryFn">
) => {
  const queryOptions = serviceTypesQueryOptions(options);
  return useQuery<T[]>({
    ...queryOptions,
  });
};

export const useCreateServiceType = (
  options?: MutationOptions<CreateServiceType>
) => {
  return useMutation({
    ...options,
    mutationFn: createServiceType,
  });
};

export const useUpdateServiceType = (
  options?: MutationOptions<ServiceType>
) => {
  return useMutation({
    ...options,
    mutationFn: updateServiceType,
  });
};

export const useDeleteServiceType = (options?: MutationOptions<string>) => {
  return useMutation({
    ...options,
    mutationFn: deleteServiceType,
  });
};

/** payment-types */
type PaymentTypesQueryOptions = Omit<
  UseQueryOptions<PaymentType[]>,
  "queryKey"
>;
export const paymentTypesQueryOptions = (options?: PaymentTypesQueryOptions) =>
  queryOptions({
    ...options,
    staleTime: FILTER_STALE_TIME,
    queryKey: PAYMENT_TYPES_KEY,
    queryFn: getPaymentTypes,
  });
export const usePaymentTypes = (
  options?: Omit<UseQueryOptions<PaymentType[]>, "queryKey" | "queryFn">
) => {
  const queryOptions = paymentTypesQueryOptions(options);
  return useQuery<PaymentType[]>({
    ...queryOptions,
    queryFn: getPaymentTypes,
  });
};

export const useCreatePaymentType = (
  options?: MutationOptions<CreatePaymentType>
) => {
  return useMutation({
    ...options,
    mutationFn: createPaymentType,
  });
};

export const useUpdatePaymentType = (
  options?: MutationOptions<UpdatePaymentType>
) => {
  return useMutation({
    ...options,
    mutationFn: updatePaymentType,
  });
};

export const useDeletePaymentType = (options?: MutationOptions<string>) => {
  return useMutation({
    ...options,
    mutationFn: deletePaymentType,
  });
};
