import { ReactNode, Suspense } from "react";

import LoadingComponent from "@/shared/ui/loading";

const withSuspense = (component: ReactNode, Loading = LoadingComponent) => {
  return <Suspense fallback={<Loading />}>{component}</Suspense>;
};

export default withSuspense;
