import {
  paymentTypesQueryOptions,
  serviceTypesQueryOptions,
  visitTypesQueryOptions,
} from "@/queries/settings";
import { Filter } from "@/zustand/selected-filter/type";
import { useSuspenseQueries } from "@tanstack/react-query";
import { BadgeType } from "@/shared/types/badge-type";
import { BADGE_TYPE } from "@/shared/constants/badge-type";

type ReturnType = {
  visitTypes: Filter[];
  paymentTypes: Filter[];
  serviceTypes: Filter[];
  genders: Filter[];
  isVisitTypesFetching: boolean;
  isVisitTypesError: boolean;
  isPaymentTypesFetching: boolean;
  isPaymentTypesError: boolean;
  isServiceTypesFetching: boolean;
  isServiceTypesError: boolean;
};

const makeFilter = (
  types: Record<string, unknown>[] = [],
  type: BadgeType
): Filter[] => {
  const filters = types.map((item) => ({
    ...item,
    type: BADGE_TYPE[type],
  }));
  return filters as Filter[];
};

const useFilterTypes = (): ReturnType => {
  const visitTypesQuery = visitTypesQueryOptions();
  const paymentTypesQuery = paymentTypesQueryOptions();
  const serviceTypesQuery = serviceTypesQueryOptions();

  const queriesResult = useSuspenseQueries({
    queries: [visitTypesQuery, paymentTypesQuery, serviceTypesQuery],
  });

  const [visitTypesResult, paymentTypesResult, serviceTypesResult] =
    queriesResult;

  const genders = [
    { id: "M", name: "남성" },
    { id: "F", name: "여성" },
  ];

  return {
    visitTypes: makeFilter(visitTypesResult.data, BADGE_TYPE.visitType),
    paymentTypes: makeFilter(paymentTypesResult.data, BADGE_TYPE.paymentType),
    serviceTypes: makeFilter(serviceTypesResult.data, BADGE_TYPE.serviceType),
    genders: makeFilter(genders, BADGE_TYPE.gender),
    isVisitTypesFetching: visitTypesResult.isFetching,
    isPaymentTypesFetching: paymentTypesResult.isFetching,
    isServiceTypesFetching: serviceTypesResult.isFetching,
    isVisitTypesError: visitTypesResult.isError,
    isPaymentTypesError: paymentTypesResult.isError,
    isServiceTypesError: serviceTypesResult.isError,
  };
};

export default useFilterTypes;
