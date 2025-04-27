import { useQueryClient } from "@tanstack/react-query";
import {
  paymentTypesQueryOptions,
  serviceTypesQueryOptions,
  visitTypesQueryOptions,
} from "@/queries/settings";
import { useCallback, useEffect, useRef } from "react";

const usePrefetchFilters = () => {
  const isMount = useRef(false);
  const queryClient = useQueryClient();

  const visitTypesOptions = visitTypesQueryOptions();
  const serviceTypesOptions = serviceTypesQueryOptions();
  const paymentTypesOptions = paymentTypesQueryOptions();

  const prefetchFilters = useCallback(async () => {
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

  useEffect(() => {
    if (isMount.current) return;

    isMount.current = true;
    prefetchFilters();
  }, [prefetchFilters]);
};

export default usePrefetchFilters;
