"use client";

import { useCreateBulkSale } from "@/queries/sales";
import type { Payment } from "@/queries/sales/type";
import {
  usePaymentTypes,
  useServiceTypes,
  useVisitTypes,
} from "@/queries/settings";
import { PaymentType, ServiceType, VisitType } from "@/queries/settings/type";
import { ERROR_MESSAGE } from "@/shared/constants/error-message";
import { PATH } from "@/shared/constants/path";
import { KEYS } from "@/shared/constants/query-keys";
import { NUMBER_REGEX } from "@/shared/constants/regex";
import { useToast } from "@/shared/hooks/use-toast";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardFooter } from "@/shared/ui/card";
import { Label } from "@/shared/ui/label";
import PageTitle from "@/shared/ui/page-title";
import useDateStore from "@/zustand/date";
import { useQueryClient } from "@tanstack/react-query";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FieldPath, useFieldArray, useForm, useWatch } from "react-hook-form";
import PaymentArea from "./_components/payment";
import PaymentSection from "./_components/payment-section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui/accordion";
import { Checkbox } from "@/shared/ui/checkbox";

interface PaymentTypeWithChecked extends Payment {
  checked: boolean;
}

interface ServiceTypeWithChecked extends ServiceType {
  checked: boolean;
}

interface VisitTypeWithChecked extends VisitType {
  checked: boolean;
}

interface Form {
  date: string;
  bulkSales: {
    payments: PaymentTypeWithChecked[];
    services: ServiceTypeWithChecked[];
    visitTypes: VisitTypeWithChecked[];
  }[];
}

const defaultValues: Form = {
  date: "",
  bulkSales: [{ payments: [], visitTypes: [], services: [] }],
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
    isFetching,
    isError,
    isSuccess,
  } = usePaymentTypes();

  const {
    data: serviceTypes = [],
    // isFetching: isFetchingServices,
    // isError: isErrorServices,
    isSuccess: isSuccessServices,
  } = useServiceTypes<ServiceTypeWithChecked>({
    select: (data) => {
      return data.map((service) => ({
        ...service,
        checked: false,
      }));
    },
  });

  const {
    data: visitTypes = [],
    // isFetching: isFetchingVisitTypes,
    // isError: isErrorVisitTypes,
    isSuccess: isSuccessVisitTypes,
  } = useVisitTypes<VisitTypeWithChecked>({
    select: (data) => {
      return data.map((visitType) => ({
        ...visitType,
        checked: false,
      }));
    },
  });

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
      { payments, services: serviceTypes, visitTypes },
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
      const filteredEmptyPayments = sale.payments.filter(
        ({ checked, amount }) => {
          return checked && amount.length > 0 && amount !== "0";
        }
      );
      const filteredEmptyServices = sale.services.filter(
        ({ checked }) => checked
      );
      const filteredEmptyVisitTypes = sale.visitTypes.filter(
        ({ checked }) => checked
      );
      return {
        amount,
        payments: filteredEmptyPayments.map(({ typeId, amount, name }) => ({
          typeId,
          amount,
          name,
        })),
        services: filteredEmptyServices.map(({ id }) => id),
        visitTypes: filteredEmptyVisitTypes.map(({ id }) => id),
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

  const isOptionsReady = isSuccess && isSuccessServices && isSuccessVisitTypes;

  useEffect(() => {
    if (isOptionsReady && isEmptyPayments) {
      // const payments = paymentTypes.map(makePayment);
      setValue("bulkSales", [
        {
          payments: paymentTypes.map(makePayment),
          services: serviceTypes,
          visitTypes: visitTypes,
        },
      ]);
    }
  }, [isOptionsReady]);

  return (
    <form
      className="container flex flex-col gap-4"
      onSubmit={handleSubmit(handleClickSave)}
    >
      <PageTitle className="flex justify-between">
        다중 매출 입력
        <Button type="submit">저장</Button>
      </PageTitle>
      <div className="grid  gap-4">
        {fields.map((field, index) => {
          const fieldId: FieldPath<Form> = `bulkSales.${index}`;
          const amount = field.payments.reduce((prev, cur) => {
            return cur.amount ? prev + +cur.amount : prev;
          }, 0);

          return (
            <Card key={field.id}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Label className="text-gray-700">매출</Label>
                  <span className="text-lg tracking-wide">
                    {Number(amount).toLocaleString()}원
                  </span>
                </div>
                <PaymentSection isLoading={isFetching} isError={isError}>
                  {field.payments.map((payment, paymentIndex) => {
                    const id: FieldPath<Form> = `${fieldId}.payments.${paymentIndex}`;
                    const handleChangeAmount = (
                      event: React.ChangeEvent<HTMLInputElement>
                    ) => {
                      const amount = event.target.value;
                      if (NUMBER_REGEX.test(amount)) {
                        setValue(id, {
                          ...payment,
                          amount,
                          checked: true,
                        });
                      } else {
                        toast({
                          description: ERROR_MESSAGE.INPUT_ONLY_NUMBER,
                          variant: "destructive",
                        });
                      }
                    };
                    const handleCheckedChange = (checked: boolean) => {
                      setValue(id, {
                        ...payment,
                        checked,
                        amount: checked ? payment.amount : "",
                      });
                    };
                    return (
                      <PaymentArea
                        key={`${index}${payment.typeId}`}
                        id={id}
                        onCheckedChange={handleCheckedChange}
                        onChangeAmount={handleChangeAmount}
                        {...payment}
                      />
                    );
                  })}
                </PaymentSection>
                <Accordion type="single" collapsible className="w-full mt-4">
                  <AccordionItem value="serviceTypes">
                    <AccordionTrigger>서비스 유형</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-4">
                        {field.services.map(
                          ({ name, checked }, serviceIndex) => {
                            const serviceId: FieldPath<Form> = `${fieldId}.services.${serviceIndex}`;
                            return (
                              <div
                                key={serviceId}
                                className="flex items-center space-x-2 min-h-[36px]"
                              >
                                <Checkbox
                                  id={serviceId}
                                  checked={checked}
                                  onCheckedChange={(state) => {
                                    setValue(`${serviceId}.checked`, !!state);
                                  }}
                                />
                                <Label htmlFor={serviceId}>{name}</Label>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <Accordion type="single" collapsible className="w-full mt-4">
                  <AccordionItem value="visitTypes">
                    <AccordionTrigger>방문 유형</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-4">
                        {field.visitTypes.map(
                          ({ name, checked }, visitTypeIndex) => {
                            const visitTypeId: FieldPath<Form> = `${fieldId}.visitTypes.${visitTypeIndex}`;
                            return (
                              <div
                                key={visitTypeId}
                                className="flex items-center space-x-2 min-h-[36px]"
                              >
                                <Checkbox
                                  id={visitTypeId}
                                  checked={checked}
                                  onCheckedChange={(state) => {
                                    setValue(`${visitTypeId}.checked`, !!state);
                                  }}
                                />
                                <Label htmlFor={visitTypeId}>{name}</Label>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
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
