export type Setting = {
  name: string;
  value: string;
};

export type VisitType = {
  id: string;
  name: string;
};

export type UpdateVisitTypeDto = {
  id: string;
  name: string;
};

// service-types
export type ServiceType = {
  id: string;
  name: string;
};
export type CreateServiceType = Omit<ServiceType, "id">;

// payment-types
export type PaymentType = {
  id: string;
  name: string;
};

export type CreatePaymentType = {
  name: string;
};

export type UpdatePaymentType = CreatePaymentType & {
  id: string;
};
