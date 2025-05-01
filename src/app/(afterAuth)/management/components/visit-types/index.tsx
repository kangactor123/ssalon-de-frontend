import { Suspense } from "react";

import Loading from "@/shared/ui/loading";

import VisitTypesList from "./visit-types-list";
import VisitTypesHeader from "./visit-types-header";

export default function VisitTypes() {
  return (
    <div className="space-y-6">
      <VisitTypesHeader />
      <Suspense fallback={<Loading />}>
        <VisitTypesList />
      </Suspense>
    </div>
  );
}
