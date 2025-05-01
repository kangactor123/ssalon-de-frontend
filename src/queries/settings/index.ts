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
import { KEYS } from "@/shared/constants/query-keys";
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
type VisitTypesQueryOptions = Omit<UseQueryOptions<VisitType[]>, "queryKey">;
export const visitTypesQueryOptions = (options?: VisitTypesQueryOptions) =>
  queryOptions({
    ...options,
    staleTime: FILTER_STALE_TIME,
    queryKey: [KEYS.filters, KEYS.visitTypes.list],
    queryFn: getVisitTypes,
  });

export const useVisitTypes = (
  options?: Omit<UseQueryOptions<VisitType[]>, "queryKey" | "queryFn">
) => {
  const queryOptions = visitTypesQueryOptions(options);
  return useQuery<VisitType[]>({
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
type ServiceTypesQueryOptions = Omit<
  UseQueryOptions<ServiceType[]>,
  "queryKey"
>;
export const serviceTypesQueryOptions = (options?: ServiceTypesQueryOptions) =>
  queryOptions({
    ...options,
    staleTime: FILTER_STALE_TIME,
    queryKey: [KEYS.filters, KEYS.serviceTypes.list],
    queryFn: getServiceTypes,
  });
export const useServiceTypes = (
  options?: Omit<UseQueryOptions<ServiceType[]>, "queryKey" | "queryFn">
) => {
  const queryOptions = serviceTypesQueryOptions(options);
  return useQuery<ServiceType[]>({
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
    queryKey: [KEYS.filters, KEYS.paymentTypes.list],
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
