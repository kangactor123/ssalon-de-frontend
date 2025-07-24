import api from "@/shared/lib/axios";

import {
  CreateBulkSaleDTO,
  CreateSaleDto,
  GetSalesParams,
  Sale,
  UpdateSaleDto,
} from "./type";

export async function getSales(params: GetSalesParams) {
  const { data } = await api({
    method: "GET",
    url: "/sales",
    params: {
      date: params.date,
    },
  });

  return data as Sale[];
}

export async function getSale(saleId: string) {
  const { data } = await api({
    method: "GET",
    url: `/sales/${saleId}`,
  });

  return data as Sale;
}

export async function getTotalAmount(date: string) {
  const { data } = await api({
    method: "GET",
    url: `/sales/total-amount?date=${date}`,
  });

  return data as number;
}

export const createSale = async (dto: CreateSaleDto): Promise<unknown> => {
  const { data } = await api({
    method: "POST",
    url: "/sales",
    data: dto,
  });
  return data;
};

export const createBulkSale = async (
  dto: CreateBulkSaleDTO
): Promise<unknown> => {
  const { data } = await api({
    method: "POST",
    url: "/sales/bulk",
    data: dto,
  });
  return data;
};

export const updateSale = async (dto: UpdateSaleDto): Promise<unknown> => {
  const { data } = await api({
    method: "PUT",
    url: `/sales/${dto.id}`,
    data: dto,
  });
  return data;
};

export const deleteSale = async (id: string): Promise<unknown> => {
  const { data } = await api({
    method: "DELETE",
    url: `/sales/${id}`,
  });
  return data;
};
