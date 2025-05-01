import { useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  paymentTypesQueryOptions,
  serviceTypesQueryOptions,
  visitTypesQueryOptions,
} from "@/queries/settings";

type Result = {
  isMount: boolean;
  prefetchFilters: () => void;
};

const usePrefetchFilters = (): Result => {
  const isMount = useRef(false);
  const queryClient = useQueryClient();

  const visitTypesOptions = visitTypesQueryOptions();
  const serviceTypesOptions = serviceTypesQueryOptions();
  const paymentTypesOptions = paymentTypesQueryOptions();

  const prefetchFilters = useCallback(async () => {
    if (isMount.current) return;
    isMount.current = true;

    await queryClient.prefetchQuery({
      ...visitTypesOptions,
    });
    await queryClient.prefetchQuery({
      ...serviceTypesOptions,
    });
    await queryClient.prefetchQuery({
      ...paymentTypesOptions,
    });
  }, [
    queryClient,
    visitTypesOptions,
    serviceTypesOptions,
    paymentTypesOptions,
  ]);

  return {
    isMount: isMount.current,
    prefetchFilters,
  };
};

export default usePrefetchFilters;
