import { ReactNode, Suspense, useCallback } from "react";
import dynamic from "next/dynamic";

const Loading = dynamic(() => import("@/shared/ui/loading"));

export const useSuspense = () => {
  return useCallback((children: ReactNode) => {
    return <Suspense fallback={<Loading />}>{children}</Suspense>;
  }, []);
};
