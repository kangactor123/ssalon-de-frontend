"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CreateSaleDto,
  Gender,
  Payment,
  Sale,
  UpdateSaleDto,
} from "@/queries/sales/type";
import { useForm, useWatch } from "react-hook-form";
import { useToast } from "@/shared/hooks/use-toast";
import { useCreateSale, useSale, useUpdateSale } from "@/queries/sales";
import { useServiceTypes } from "@/queries/service-types";
import { usePaymentTypes } from "@/queries/payment-types";
import { RequiredLabel } from "@/components/ui/required-label";
import dayjs from "dayjs";
import useDateStore from "@/zustand/date";

type SaleForm = Omit<Sale, "services" | "payments" | "id" | "date"> & {
  date: string;
  time: string;
  services: string[];
  payments: Payment[];
  id?: string;
};

const genderItems = [
  { label: "남성", value: "M" },
  { label: "여성", value: "F" },
];

const SaleEditPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { date } = useDateStore();

  const id = searchParams.get("saleId") ?? "";
  const isEdit = !!id;
  const defaultValues: SaleForm = useMemo(
    () => ({
      date: dayjs(date).format("YYYY-MM-DD"),
      amount: "",
      services: [],
      description: "",
      id: "",
      payments: [],
      gender: "M",
      time: "09:00",
      isFirst: false,
    }),
    [date]
  );

  const { register, handleSubmit, formState, reset, setValue, control } =
    useForm<SaleForm>({
      defaultValues,
      mode: "onChange",
    });

  const gender = useWatch({ control, name: "gender" });
  const selectedServices = useWatch({ control, name: "services" });
  const payments = useWatch({ control, name: "payments" });
  const selectedTime = useWatch({ control, name: "time" });
  const checkIsFirst = useWatch({ control, name: "isFirst" });

  const { data: sale } = useSale(id, {
    enabled: isEdit,
  });

  const { data: serviceTypes = [] } = useServiceTypes();
  const { data: paymentTypes = [] } = usePaymentTypes();
  const [timeAccordion, setTimeAccordion] = useState("");

  const onSuccessCallback = useCallback(() => {
    reset(defaultValues);
    router.push("/sales");
  }, [defaultValues, reset, router]);

  const { mutate: createSale } = useCreateSale({
    onSuccess: onSuccessCallback,
  });
  const { mutate: updateSale } = useUpdateSale({
    onSuccess: onSuccessCallback,
  });

  const validateForm = useCallback((data: SaleForm) => {
    const validate = {
      message: "",
      flag: true,
    };
    if (+data.amount === 0) {
      validate.message = "결제 유형을 통해 금액을 입력해주세요.";
      validate.flag = false;
      return validate;
    } else if (data.payments.length === 0) {
      validate.message = "결제 유형을 선택해주세요.";
      validate.flag = false;
      return validate;
    } else if (!!data.time || !!data.date) {
      if (!data.time) {
        validate.message = "날짜를 입력한 경우 시간을 필수로 선택해주세요.";
        validate.flag = false;
        return validate;
      } else if (!data.date) {
        validate.message = "시간을 선택한 경우 날짜를 필수로 입력해주세요.";
        validate.flag = false;
      }
    }
    return validate;
  }, []);

  const onSubmit = useCallback(
    (sale: SaleForm) => {
      const inputData = {
        date: sale.date,
        time: sale.time,
        amount: sale.amount,
        services: sale.services,
        description: sale.description,
        gender: sale.gender,
        payments: sale.payments,
        isFirst: sale.isFirst,
      };

      const { message, flag } = validateForm(inputData);

      if (flag) {
        const services = sale.services.reduce((prev, cur) => {
          const service = serviceTypes.find((service) => service.id === cur);
          if (service) {
            prev.push(service.id);
          }
          return prev;
        }, [] as string[]);

        const dto: CreateSaleDto | UpdateSaleDto = {
          date: dayjs(`${inputData.date} ${inputData.time}`).format(),
          amount: inputData.amount,
          services,
          description: inputData.description,
          gender: inputData.gender,
          payments: inputData.payments,
          isFirst: inputData.isFirst,
        };

        if (isEdit) {
          updateSale({
            id,
            ...dto,
          });
        } else {
          createSale(dto);
        }
      } else {
        toast({
          variant: "destructive",
          description: message,
        });
      }
    },
    [createSale, id, isEdit, serviceTypes, toast, updateSale, validateForm]
  );

  const handleServiceChange = useCallback(
    (serviceId: string) => {
      const newServices = selectedServices.includes(serviceId)
        ? selectedServices.filter((id) => id !== serviceId)
        : [...selectedServices, serviceId];
      setValue("services", newServices);
    },
    [selectedServices, setValue]
  );

  const isFormDisabled = useMemo(() => {
    const hasError = Object.keys(formState.errors).length > 0;
    return paymentTypes.length === 0 || formState.isSubmitting || hasError;
  }, [paymentTypes, formState]);

  const timeSlots = useMemo(
    () =>
      Array.from({ length: 27 }, (_, i) => {
        const hour = Math.floor(i / 2) + 9;
        const minute = i % 2 === 0 ? "00" : "30";
        return `${hour.toString().padStart(2, "0")}:${minute}`;
      }),
    []
  );

  const title = isEdit ? "매출 수정" : "매출 등록";

  useEffect(() => {
    if (paymentTypes.length > 0) {
      setValue("payments", [
        { typeId: paymentTypes[0].id, name: paymentTypes[0].name, amount: "" },
      ]);
    }
  }, [paymentTypes, setValue]);

  useEffect(() => {
    if (isEdit && sale) {
      reset({
        time: dayjs(sale.date).format("HH:mm"),
        date: dayjs(sale.date).format("YYYY-MM-DD"),
        amount: sale.amount,
        services: sale.services.map((service) => service.id),
        gender: sale.gender,
        payments: sale.payments,
        description: sale.description ?? "",
        id: sale.id,
        isFirst: sale.isFirst,
      });
    }
  }, [isEdit, reset, sale]);

  useEffect(() => {
    if (payments.length === 0) {
      setValue("amount", "");
    } else {
      const totalAmount = payments.reduce(
        (prev, { amount }) => prev + +amount,
        0
      );
      setValue("amount", `${totalAmount}`);
    }
  }, [payments, setValue]);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">{title}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>매출 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <RequiredLabel htmlFor="amount">합산 금액</RequiredLabel>
                <Input {...register("amount")} id="amount" disabled required />
              </div>
              <div className="space-y-2">
                <RequiredLabel htmlFor="date" required>
                  날짜
                </RequiredLabel>
                <Input
                  {...register("date")}
                  id="date"
                  type="date"
                  placeholder="결제 유형을 클릭해 매출을 입력해주세요."
                />
              </div>
            </div>
            <div className="space-y-2">
              <RequiredLabel required>결제 유형</RequiredLabel>
              {paymentTypes.length === 0 && (
                <div className="flex flex-col items-center py-4 space-y-2 text-xs text-gray-500">
                  <p>결제 유형이 존재하지 않습니다.</p>
                  <p>관리 메뉴에서 결제 유형을 생성해주세요.</p>
                </div>
              )}
              {paymentTypes.map(({ id, name }) => {
                const targetIndex = payments.findIndex(
                  ({ typeId }) => typeId === id
                );
                const isChecked = targetIndex !== -1;
                return (
                  <div
                    key={`payments${id}`}
                    className="flex items-center space-x-3 min-h-[36px]"
                  >
                    <Checkbox
                      id={`payment${id}`}
                      checked={isChecked}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setValue("payments", [
                            ...payments,
                            { typeId: id, name, amount: "" },
                          ]);
                        } else {
                          setValue(
                            "payments",
                            payments.filter(({ typeId }) => typeId !== id)
                          );
                        }
                      }}
                    />
                    <Label htmlFor={`payment-${name}`} className="w-24">
                      {name}
                    </Label>
                    {isChecked && (
                      <Input
                        value={payments[targetIndex].amount}
                        onChange={(event) => {
                          if (!isNaN(Number(event.target.value))) {
                            setValue(
                              `payments.${targetIndex}.amount`,
                              event.target.value
                            );
                          } else {
                            toast({
                              description: "숫자만 입력해주세요.",
                              variant: "destructive",
                            });
                          }
                        }}
                        key={`payments.${targetIndex}.amount`}
                        placeholder="금액"
                        className="w-32"
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <Accordion
              type="single"
              collapsible
              className="w-full"
              value={timeAccordion}
              onValueChange={setTimeAccordion}
            >
              <AccordionItem value="time">
                <AccordionTrigger>
                  <RequiredLabel required value={selectedTime}>
                    시간 선택
                  </RequiredLabel>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        type="button"
                        variant={selectedTime === time ? "default" : "outline"}
                        onClick={() => {
                          if (selectedTime === time) {
                            setValue("time", "");
                          } else {
                            setValue("time", time);
                          }
                          setTimeAccordion("");
                        }}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="serviceTypes">
                <AccordionTrigger>성별</AccordionTrigger>
                <AccordionContent>
                  <RadioGroup
                    value={gender}
                    onValueChange={(value) =>
                      setValue("gender", value as Gender)
                    }
                    className="flex gap-4"
                    required
                  >
                    {genderItems.map(({ label, value }) => (
                      <div key={value} className="flex items-center space-x-2">
                        <RadioGroupItem value={value} id={`gender-${value}`} />
                        <Label htmlFor={`gender-${value}`}>{label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Accordion
              type="single"
              collapsible
              className="w-full"
              disabled={serviceTypes.length === 0}
            >
              <AccordionItem value="serviceTypes">
                <AccordionTrigger disabled={serviceTypes.length === 0}>
                  서비스 유형
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-4">
                    {serviceTypes.map((service) => (
                      <div
                        key={service.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`service-${service.id}`}
                          checked={selectedServices.includes(service.id)}
                          onCheckedChange={() => {
                            handleServiceChange(service.id);
                          }}
                        />
                        <Label htmlFor={`service-${service.id}`}>
                          {service.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="isFirst">
                <AccordionTrigger>
                  <RequiredLabel>신규 여부</RequiredLabel>
                </AccordionTrigger>
                <AccordionContent className="flex gap-2 items-center">
                  <Checkbox
                    id="isFirst"
                    checked={checkIsFirst}
                    onCheckedChange={(checked) => {
                      setValue("isFirst", checked as boolean);
                    }}
                  />
                  <Label htmlFor="isFirst">신규</Label>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className="space-y-2">
              <Label htmlFor="customerInfo">설명</Label>
              <Input
                {...register("description")}
                id="customerInfo"
                type="text"
                placeholder="예: 30대 여성, 단골 고객"
                className="col-span-3"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isFormDisabled}>
              매출 등록
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default SaleEditPage;
