import React, { useCallback } from "react";
import { Payment } from "@/queries/sales/type";
import { usePaymentTypes } from "@/queries/settings";
import type { PaymentType } from "@/queries/settings/type";
import { PAYMENT_TYPES_KEY } from "@/shared/constants/query-keys";
import { useToast } from "@/shared/hooks/use-toast";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import Spinner from "@/shared/ui/spinner";
import { useQueryClient } from "@tanstack/react-query";
import { LucideRotateCw } from "lucide-react";
import { useFormContext } from "react-hook-form";

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
  payments: Payment[];
  isEdit: boolean;
};

const PaymentTypes: React.FC<Props> = (props) => {
  const { payments } = props;
  const { setValue } = useFormContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: paymentTypes = [], isFetching, isError } = usePaymentTypes();

  const isEmptyPaymentTypes = paymentTypes.length === 0;

  const onClickReload = useCallback(
    (event: React.SyntheticEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      queryClient.invalidateQueries({
        queryKey: PAYMENT_TYPES_KEY,
      });
    },
    [queryClient]
  );

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

  const handlePaymentTypeAmountChange = useCallback(
    (amount: string, targetIndex: number) => {
      if (!isNaN(Number(amount))) {
        setValue(`payments.${targetIndex}.amount`, amount);
      } else {
        toast({
          description: "숫자만 입력해주세요.",
          variant: "destructive",
        });
      }
    },
    [setValue, toast]
  );

  if (isFetching) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Spinner />
      </div>
    );
  }

  if (isEmptyPaymentTypes || isError) {
    return (
      <div className="flex flex-col items-center py-4 space-y-2 text-xs text-gray-500">
        <p>결제 유형이 존재하지 않거나 호출을 실패했습니다.</p>
        <p>결제 유형이 존재하는 경우 새로고침을 클릭해주세요.</p>
        <Button
          type="button"
          className="mt-2"
          size="sm"
          variant="outline"
          onClick={onClickReload}
        >
          <LucideRotateCw className="text-gray-500" />
        </Button>
      </div>
    );
  }

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

export default PaymentTypes;
