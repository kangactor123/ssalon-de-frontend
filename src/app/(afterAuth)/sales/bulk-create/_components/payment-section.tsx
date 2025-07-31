import { PropsWithChildren } from "react";
import PaymentSkeleton from "./payment-skeleton";

type Props = PropsWithChildren<{
  isLoading: boolean;
  isError: boolean;
}>;

const MOCK_LOADING = Array.from({ length: 4 }, (_, index) => index);

const PaymentSection: React.FC<Props> = ({ isLoading, isError, children }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 mt-4">
        {MOCK_LOADING.map((index) => (
          <PaymentSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-6 mt-4">
        <span className="text-red-500">
          결제 정보를 불러오는 데 실패했습니다.
        </span>
      </div>
    );
  }

  return <div className="flex flex-col gap-6 mt-4">{children}</div>;
};

export default PaymentSection;
