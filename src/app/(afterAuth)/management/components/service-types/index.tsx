import { Suspense } from "react";

import Loading from "@/shared/ui/loading";

import ServiceTypesHeader from "./service-types-header";
import ServiceList from "./service-types-list";

export default function ServiceTypes() {
  return (
    <div className="space-y-6">
      <ServiceTypesHeader />
      <Suspense fallback={<Loading />}>
        <ServiceList />
      </Suspense>
    </div>
  );
}
