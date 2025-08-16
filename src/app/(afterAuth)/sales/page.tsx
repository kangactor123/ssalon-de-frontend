import SalesHeader from "./_components/sales-header";
import SalesContainer from "./_components/sales-container";

export default function SalesPage() {
  return (
    <div className="flex flex-col gap-3">
      <SalesHeader />
      <SalesContainer />
    </div>
  );
}
