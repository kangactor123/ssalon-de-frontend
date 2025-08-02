import { PropsWithChildren } from "react";
import PaymentSkeleton from "./payment-skeleton";
import { RequiredLabel } from "@/shared/ui/required-label";

type Props = PropsWithChildren<{
  isLoading: boolean;
  isError: boolean;
}>;

const MOCK_LOADING = Array.from({ length: 4 }, (_, index) => index);

const PaymentSection: React.FC<Props> = ({ isLoading, isError, children }) => {
  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 gap-4">
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

  return (
    <div className="flex flex-col gap-8 mt-4">
      <RequiredLabel required>결제 유형</RequiredLabel>
      <div className="grid md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
};

export default PaymentSection;
