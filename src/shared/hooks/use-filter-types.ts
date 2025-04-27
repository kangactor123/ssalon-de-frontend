import {
  paymentTypesQueryOptions,
  serviceTypesQueryOptions,
  visitTypesQueryOptions,
} from "@/queries/settings";
import {
  GenderType,
  PaymentType,
  ServiceType,
  VisitType,
} from "@/queries/settings/type";
import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";

type ReturnType = {
  visitTypes: VisitType[];
  paymentTypes: PaymentType[];
  serviceTypes: ServiceType[];
  genders: GenderType[];
  isLoading: boolean;
  isError: boolean;
  isVisitTypesFetching: boolean;
  isVisitTypesError: boolean;
  isPaymentTypesFetching: boolean;
  isPaymentTypesError: boolean;
  isServiceTypesFetching: boolean;
  isServiceTypesError: boolean;
};

const useFilterTypes = (): ReturnType => {
  const visitTypesQuery = visitTypesQueryOptions();
  const paymentTypesQuery = paymentTypesQueryOptions();
  const serviceTypesQuery = serviceTypesQueryOptions();

  const queriesResult = useQueries({
    queries: [visitTypesQuery, paymentTypesQuery, serviceTypesQuery],
  });

  const [visitTypesResult, paymentTypesResult, serviceTypesResult] =
    queriesResult;

  const genders = useMemo(
    () => [
      { id: "M", name: "남성" },
      { id: "F", name: "여성" },
    ],
    []
  );

  const isLoading =
    visitTypesResult.isLoading &&
    paymentTypesResult.isLoading &&
    serviceTypesResult.isLoading;

  const isError =
    visitTypesResult.isError ||
    paymentTypesResult.isError ||
    serviceTypesResult.isError;

  return {
    visitTypes: visitTypesResult.data ?? [],
    paymentTypes: paymentTypesResult.data ?? [],
    serviceTypes: serviceTypesResult.data ?? [],
    genders,
    isLoading,
    isError,
    isVisitTypesFetching: visitTypesResult.isFetching,
    isPaymentTypesFetching: paymentTypesResult.isFetching,
    isServiceTypesFetching: serviceTypesResult.isFetching,
    isVisitTypesError: visitTypesResult.isError,
    isPaymentTypesError: paymentTypesResult.isError,
    isServiceTypesError: serviceTypesResult.isError,
  };
};

export default useFilterTypes;
