export const KEYS = {
  filters: "FILTERS",
  serviceTypes: {
    list: "SERVICE-TYPES",
  },
  paymentTypes: {
    list: "PAYMENT-TYPES",
  },
  visitTypes: {
    list: "VISIT-TYPES",
  },
  settings: {
    list: "SETTINGS",
  },
  sales: {
    list: "SALES",
    totalAmount: "TOTAL-AMOUNT",
  },
  user: {
    info: "USER-INFO",
    signUp: "SIGN_UP",
  },
  dashboard: {
    widget: {
      monthlySales: "MONTHLY-SALES",
      monthlyTotalSales: "MONTHLY-TOTAL-SALES",
      targetTotalSales: "TARGET-TOTAL-SALES",
      genderRatio: "GENDER-RATIO",
      dailySalesAmountCount: "DAILY-SALES-AMOUNT-COUNT",
      visitTypesRatio: "VISIT-TYPES-RATIO",
      averageCustomerSpending: "AVERAGE-CUSTOMER-SPENDING",
      totalCount: "TOTAL-COUNT",
    },
  },
};

export const VISIT_TYPES_KEY = [KEYS.filters, KEYS.visitTypes.list];
export const SERVICE_TYPES_KEY = [KEYS.filters, KEYS.serviceTypes.list];
export const PAYMENT_TYPES_KEY = [KEYS.filters, KEYS.paymentTypes.list];
