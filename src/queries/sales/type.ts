import { ServiceType, VisitType } from "@/queries/settings/type";

export type Gender = "M" | "F";
export type GetSalesParams = {
  date: string;
};

export type Payment = {
  amount: string;
  typeId: string;
  name: string;
};

export type Sale = {
  id: string;
  date: string;
  amount: string;
  services: ServiceType[];
  payments: Payment[];
  gender: Gender;
  description?: string;
  visitTypes: VisitType[];
};

export type CreateSaleDto = Omit<
  Sale,
  "id" | "services" | "paymentType" | "date" | "visitTypes"
> & {
  visitTypes: string[];
  date: string;
  services: string[];
  payments: Payment[];
};
export type UpdateSaleDto = CreateSaleDto & { id: string };

export type BulkSale = {
  amount: number;
};

export type CreateBulkSaleDTO = {
  date: string;
  bulkSales: number[];
};
