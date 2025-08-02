import api from "@/shared/lib/axios";
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

export const getSettings = async (): Promise<Setting[]> => {
  const { data } = await api({
    method: "GET",
    url: "/settings",
  });
  return data as Setting[];
};

export const editSettings = async (dto: Setting[]) => {
  const { data } = await api({
    method: "POST",
    url: "/settings",
    data: dto,
  });
  return data;
};

/** visit-types */
export const getVisitTypes = async <T = VisitType>(): Promise<T[]> => {
  const { data } = await api({
    method: "GET",
    url: "/settings/visit-types",
  });
  return data as T[];
};

export const createVisitType = async (name: string): Promise<VisitType> => {
  const { data } = await api({
    method: "POST",
    url: "/settings/visit-types",
    data: {
      name,
    },
  });
  return data;
};

export const updateVisitType = async (
  dto: UpdateVisitTypeDto
): Promise<VisitType> => {
  const { data } = await api({
    method: "PUT",
    url: `/settings/visit-types/${dto.id}`,
    data: {
      name: dto.name,
    },
  });
  return data;
};

export const deleteVisitType = async (id: string): Promise<VisitType> => {
  const { data } = await api({
    method: "DELETE",
    url: `/settings/visit-types/${id}`,
  });
  return data;
};

/** service-types */
export const getServiceTypes = async <T = ServiceType>(): Promise<T[]> => {
  const { data } = await api({
    method: "GET",
    url: "/service-types",
  });

  return data as T[];
};

export const createServiceType = async (
  dto: CreateServiceType
): Promise<unknown> => {
  const { data } = await api({
    method: "POST",
    url: "/service-types",
    data: dto,
  });
  return data;
};

export const updateServiceType = async (dto: ServiceType): Promise<unknown> => {
  const { data } = await api({
    method: "PUT",
    url: `/service-types/${dto.id}`,
    data: {
      name: dto.name,
      price: dto.price,
    },
  });
  return data;
};

export const deleteServiceType = async (id: string): Promise<unknown> => {
  const { data } = await api({
    method: "DELETE",
    url: `/service-types/${id}`,
  });
  return data;
};

/** payment-types */
export const getPaymentTypes = async (): Promise<PaymentType[]> => {
  const { data } = await api({
    method: "GET",
    url: "/payment-types",
  });
  return data;
};

export const createPaymentType = async (
  dto: CreatePaymentType
): Promise<unknown> => {
  const { data } = await api({
    method: "POST",
    url: "/payment-types",
    data: dto,
  });
  return data;
};

export const updatePaymentType = async (
  dto: UpdatePaymentType
): Promise<unknown> => {
  const { data } = await api({
    method: "PUT",
    url: `/payment-types/${dto.id}`,
    data: dto,
  });
  return data;
};

export const deletePaymentType = async (id: string): Promise<unknown> => {
  const { data } = await api({
    method: "DELETE",
    url: `/payment-types/${id}`,
  });
  return data;
};
