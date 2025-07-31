"use client";

import { useCreateBulkSale } from "@/queries/sales";
import { Payment } from "@/queries/sales/type";
import { usePaymentTypes } from "@/queries/settings";
import { PaymentType } from "@/queries/settings/type";
import { ERROR_MESSAGE } from "@/shared/constants/error-message";
import { PATH } from "@/shared/constants/path";
import { KEYS } from "@/shared/constants/query-keys";
import { NUMBER_REGEX } from "@/shared/constants/regex";
import { useToast } from "@/shared/hooks/use-toast";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardFooter } from "@/shared/ui/card";
import { Checkbox } from "@/shared/ui/checkbox";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import PageTitle from "@/shared/ui/page-title";
import useDateStore from "@/zustand/date";
import { useQueryClient } from "@tanstack/react-query";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

interface PaymentTypeWithChecked extends Payment {
  checked: boolean;
}

interface Form {
  date: string;
  bulkSales: {
    payments: PaymentTypeWithChecked[];
  }[];
}

const defaultValues: Form = {
  date: "",
  bulkSales: [{ payments: [] }],
};

const makePayment = (paymentType: PaymentType): PaymentTypeWithChecked => {
  return {
    typeId: paymentType.id,
    name: paymentType.name,
    amount: "",
    checked: false,
  };
};

const BulkPage = () => {
  const { toast } = useToast();
  const router = useRouter();
  const client = useQueryClient();
  const date = useDateStore((state) => state.date);
  const { control, handleSubmit, reset, setValue } = useForm<Form>({
    defaultValues: {
      ...defaultValues,
      date,
    },
  });

  const { mutate: createBulkSales } = useCreateBulkSale({
    onSuccess: () => {
      reset(defaultValues);
      client.invalidateQueries({
        queryKey: [KEYS.sales.list, date],
      });
      router.push(PATH.SALES);
      toast({
        description: "매출이 성공적으로 등록되었습니다.",
      });
    },
    onError: () => {
      toast({
        description: "매출 등록에 실패했습니다.",
        variant: "destructive",
      });
    },
  });

  const {
    data: paymentTypes = [],
    // isFetching,
    // isError,
    isSuccess,
  } = usePaymentTypes();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "bulkSales",
    rules: {
      minLength: {
        value: 1,
        message: ERROR_MESSAGE.NEED_MINIMUM_ONE_SALE,
      },
    },
  });

  const bulkSales = useWatch({ control, name: "bulkSales" });

  const isEmptyPayments = bulkSales.every(
    ({ payments }) => payments.length === 0
  );

  const appendField = () => {
    const payments = paymentTypes.map(makePayment);
    append(
      { payments },
      {
        shouldFocus: true,
      }
    );
  };

  const removeField = (index: number) => {
    if (fields.length === 1) {
      return toast({
        description: ERROR_MESSAGE.NEED_MINIMUM_ONE_SALE,
        variant: "destructive",
      });
    }

    remove(index);
  };

  const isLastIndex = (index: number) => {
    return index === fields.length - 1;
  };

  const handleClickSave = (formData: Form) => {
    const bulkSales = formData.bulkSales.map((sale) => {
      const amount = sale.payments.reduce((prev, cur) => {
        return cur.checked ? prev + (+cur.amount || 0) : prev;
      }, 0);
      const filterdEmptyPayments = sale.payments.filter(
        ({ checked, amount }) => {
          return checked && amount.length > 0 && amount !== "0";
        }
      );
      return {
        amount,
        payments: filterdEmptyPayments.map(({ typeId, amount, name }) => ({
          typeId,
          amount,
          name,
        })),
      };
    });

    const isValid = bulkSales.every((sale) => {
      return sale.amount > 0 && sale.payments.length > 0;
    });

    if (!isValid) {
      return toast({
        description: ERROR_MESSAGE.INVALID_BULK_SALE,
        variant: "destructive",
      });
    }

    createBulkSales({
      date: formData.date,
      bulkSales,
    });
  };

  useEffect(() => {
    if (isSuccess && isEmptyPayments) {
      const payments = paymentTypes.map(makePayment);
      setValue("bulkSales", [{ payments }]);
    }
  }, [isSuccess]);

  return (
    <form
      className="container flex flex-col gap-4"
      onSubmit={handleSubmit(handleClickSave)}
    >
      <PageTitle className="flex justify-between">
        매출 다중 입력
        <Button type="submit">저장</Button>
      </PageTitle>
      <div className="grid md:grid-cols-2 gap-4">
        {fields.map((field, index) => {
          const amount = field.payments.reduce((prev, cur) => {
            return cur.amount ? prev + +cur.amount : prev;
          }, 0);
          return (
            <Card key={field.id}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Label
                    className="text-gray-700"
                    htmlFor={`bulkSales.${index}.amount`}
                  >
                    매출
                  </Label>
                  <span className="text-lg tracking-wide">
                    {Number(amount).toLocaleString()}원
                  </span>
                </div>
                <div className="flex flex-col gap-6 mt-4">
                  {field.payments.map((payment, paymentIndex) => {
                    const onChangeCheckbox = (checked: boolean) => {
                      setValue(`bulkSales.${index}.payments.${paymentIndex}`, {
                        ...payment,
                        checked,
                        amount: checked ? payment.amount : "",
                      });
                    };

                    return (
                      <div
                        key={`${index}${payment.typeId}`}
                        className="h-6 flex items-center gap-2"
                      >
                        <Checkbox
                          id={`bulkSales.${index}.payments.${paymentIndex}`}
                          checked={payment.checked}
                          onCheckedChange={onChangeCheckbox}
                        />
                        <Label
                          htmlFor={`bulkSales.${index}.payments.${paymentIndex}`}
                        >
                          {payment.name}
                        </Label>
                        <Input
                          type="number"
                          placeholder="금액"
                          className="w-[120px] ml-2"
                          value={payment.amount}
                          onChange={(event) => {
                            const amount = event.target.value;
                            if (NUMBER_REGEX.test(amount)) {
                              setValue(
                                `bulkSales.${index}.payments.${paymentIndex}`,
                                {
                                  ...payment,
                                  amount,
                                  checked: true,
                                }
                              );
                            } else {
                              toast({
                                description: ERROR_MESSAGE.INPUT_ONLY_NUMBER,
                                variant: "destructive",
                              });
                            }
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-1">
                {isLastIndex(index) ? (
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={appendField}
                    className="rounded-icon"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </Button>
                ) : null}
                <Button
                  size="icon"
                  variant="outline"
                  onClick={(event) => {
                    event.preventDefault();
                    removeField(index);
                  }}
                >
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </form>
  );
};

export default BulkPage;
