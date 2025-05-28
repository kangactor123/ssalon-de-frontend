import { Sale } from "@/queries/sales/type";
import SalesItem from "./sales-item";
import EmptySales from "./empty-sales";
import { useRouter } from "next/navigation";

type Props = {
  isLoading: boolean;
  isEmpty: boolean;
  sales: Sale[];
  onClickSaleEdit: (id: string) => void;
  onClickSaleDelete: (id: string) => void;
};

const SalesList: React.FC<Props> = ({
  isLoading,
  isEmpty,
  sales,
  onClickSaleEdit,
  onClickSaleDelete,
}) => {
  const router = useRouter();

  if (isEmpty) {
    return (
      <EmptySales
        isLoading={isLoading}
        onClickButton={() => router.push("/sales/edit")}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {sales.map((sale) => {
        const payments = sale.payments.map(({ name }) => name);
        return (
          <SalesItem
            {...sale}
            key={sale.id}
            onClickEdit={onClickSaleEdit}
            onClickDelete={onClickSaleDelete}
            payments={payments}
          />
        );
      })}
    </div>
  );
};

export default SalesList;
