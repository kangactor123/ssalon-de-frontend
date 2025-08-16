export type DailySale = {
  date: string;
  amount: number;
};

export type MonthlyTotalSales = {
  date: string;
  amount: number;
  payments: { type: string; amount: number }[];
};

export type TargetTotalSales = {
  targetSales: number;
  totalSales: number;
};

export type GenderRatio = {
  female: number;
  male: number;
};

export type DailySaleAmountCount = DailySale & {
  count: number;
};

export type VisitTypesRatio = Record<string, number>;
export type ServiceTypesRatio = Record<string, number>;

export type AverageCustomerSpending = {
  currentMonth: number;
  previousMonth: number;
};

export type TotalCount = {
  count: number;
};
