import SalesHeader from "./components/sales-header";
import SalesContainer from "./components/sales-container";
import { Suspense } from "react";
import SalesItemSkeleton from "./components/sales-item-skeleton";
import SalesFilterSkeleton from "./components/sales-filter-skeleton";
import { SalesFilter } from "./components/sales-filter";

export default function SalesPage() {
  return (
    <div className="flex flex-col gap-3">
      <SalesHeader />
      <Suspense fallback={<SalesFilterSkeleton />}>
        <SalesFilter />
      </Suspense>
      <Suspense fallback={<SalesItemSkeleton />}>
        <SalesContainer />
      </Suspense>
    </div>
  );
}
