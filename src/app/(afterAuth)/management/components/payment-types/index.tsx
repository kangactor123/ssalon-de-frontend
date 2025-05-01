import { Suspense } from "react";

import Loading from "@/shared/ui/loading";

import PaymentTypesHeader from "./payment-types-header";
import PaymentTypeList from "./payment-types-list";

export default function PaymentTypes() {
  return (
    <div className="space-y-6">
      <PaymentTypesHeader />
      <Suspense fallback={<Loading />}>
        <PaymentTypeList />
      </Suspense>
    </div>
  );
}
