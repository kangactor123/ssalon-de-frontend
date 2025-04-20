import { Payment } from "@/queries/sales/type";
import type { PaymentType } from "@/queries/settings/type";
import { KEYS } from "@/shared/constants/query-keys";
import { useToast } from "@/shared/hooks/use-toast";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import Spinner from "@/shared/ui/spinner";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { UseFormSetValue } from "react-hook-form";

type PaymentTypeProps = {
  isChecked: boolean;
  name: string;
  targetIndex: number;
  amount: string;
  onCheckedChange: (checked: boolean) => void;
  onPaymentTypeAmountChange: (amount: string, targetIndex: number) => void;
};

const PaymentType: React.FC<PaymentTypeProps> = ({
  isChecked,
  name,
  targetIndex,
  amount,
  onCheckedChange,
  onPaymentTypeAmountChange,
}) => {
  return (
    <div className="flex items-center space-x-3 min-h-[36px]">
      <Checkbox
        id={`payment-${name}`}
        checked={isChecked}
        onCheckedChange={onCheckedChange}
      />
      <Label htmlFor={`payment-${name}`} className="w-24">
        {name}
      </Label>
      {isChecked && (
        <Input
          value={amount}
          onChange={({ target: { value } }) =>
            onPaymentTypeAmountChange(value, targetIndex)
          }
          key={`payments.${targetIndex}.amount`}
          placeholder="금액"
          className="w-32"
        />
      )}
    </div>
  );
};

const MemoizedPayment = React.memo(PaymentType);

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: UseFormSetValue<any>;
  isEmptyPaymentTypes: boolean;
  isLoading: boolean;
  payments: Payment[];
  paymentTypes: PaymentType[];
};

const PaymentTypes: React.FC<Props> = (props) => {
  const { toast } = useToast();
  const { isEmptyPaymentTypes, isLoading, paymentTypes, payments, setValue } =
    props;

  const queryClient = useQueryClient();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Spinner />
      </div>
    );
  }

  const onClickReload = (event: React.SyntheticEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    queryClient.invalidateQueries({
      queryKey: [KEYS.paymentTypes.list],
    });
  };

  if (isEmptyPaymentTypes) {
    return (
      <div className="flex flex-col items-center py-4 space-y-2 text-xs text-gray-500">
        <p>결제 유형이 존재하지 않습니다.</p>
        <p>관리 메뉴에서 결제 유형을 생성해주세요.</p>
        <p>
          결제 유형이 존재하는 경우 아래 버튼을 통해 데이터를 다시 호출해주세요.
        </p>
        <Button
          type="button"
          className="mt-2"
          size="sm"
          variant="outline"
          onClick={onClickReload}
        >
          Reload
        </Button>
      </div>
    );
  }

  const handleCheckedChange = (checked: boolean, id: string) => {
    const paymentType = paymentTypes.find((type) => type.id === id);
    if (checked) {
      setValue("payments", [
        ...payments,
        { typeId: id, name: paymentType?.name, amount: "" },
      ]);
    } else {
      setValue(
        "payments",
        payments.filter(({ typeId }) => typeId !== id)
      );
    }
  };

  const handlePaymentTypeAmountChange = (
    amount: string,
    targetIndex: number
  ) => {
    if (!isNaN(Number(amount))) {
      setValue(`payments.${targetIndex}.amount`, amount);
    } else {
      toast({
        description: "숫자만 입력해주세요.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {paymentTypes.map(({ id, name }) => {
        const targetIndex = payments.findIndex(({ typeId }) => typeId === id);
        const isChecked = targetIndex !== -1;
        return (
          <MemoizedPayment
            key={`payments${id}`}
            isChecked={isChecked}
            name={name}
            targetIndex={targetIndex}
            amount={isChecked ? payments[targetIndex].amount : ""}
            onCheckedChange={(checked) => {
              handleCheckedChange(Boolean(checked), id);
            }}
            onPaymentTypeAmountChange={handlePaymentTypeAmountChange}
          />
        );
      })}
    </div>
  );
};

export default React.memo(PaymentTypes);
