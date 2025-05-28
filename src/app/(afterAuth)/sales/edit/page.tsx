"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import {
  CreateSaleDto,
  Payment,
  Sale,
  UpdateSaleDto,
} from "@/queries/sales/type";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useToast } from "@/shared/hooks/use-toast";
import { useCreateSale, useSale, useUpdateSale } from "@/queries/sales";
import { RequiredLabel } from "@/shared/ui/required-label";
import dayjs from "dayjs";
import useDateStore from "@/zustand/date";
import { formatDate } from "@/shared/utils/dayjs";
import PaymentTypes from "./components/payment-types";
import ServiceTypes from "./components/service-types";
import VisitTypes from "./components/visit-types";
import { PATH } from "@/shared/constants/path";
import {
  usePaymentTypes,
  useServiceTypes,
  useVisitTypes,
} from "@/queries/settings";
import { useQueryClient } from "@tanstack/react-query";
import { KEYS } from "@/shared/constants/query-keys";
import TimeSelectField from "./components/time-select-field";
import GenderSelectField from "./components/gender-select-field";

type SaleForm = Omit<Sale, "services" | "payments" | "id" | "date"> & {
  date: string;
  time: string;
  services: string[];
  visitTypes: string[];
  payments: Payment[];
  id?: string;
};

const SaleEditPage = () => {
  const router = useRouter();
  const isTouchTime = useRef(false);
  const client = useQueryClient();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { date } = useDateStore();

  const id = searchParams.get("saleId") ?? "";
  const isEdit = !!id;
  const title = isEdit ? "매출 수정" : "매출 등록";

  const [timeAccordion, setTimeAccordion] = useState("");

  const defaultValues: SaleForm = useMemo(
    () => ({
      date: formatDate({ date }),
      amount: "",
      services: [],
      description: "",
      id: "",
      payments: [],
      visitTypes: [],
      gender: "M",
      time: "09:00",
    }),
    [date]
  );

  const { data: paymentTypes = [] } = usePaymentTypes();
  const { data: serviceTypes = [] } = useServiceTypes();
  useVisitTypes();

  const formMethods = useForm<SaleForm>({
    defaultValues,
    mode: "onChange",
  });

  const { register, handleSubmit, formState, reset, setValue, control } =
    formMethods;

  const amount = useWatch({ control, name: "amount" });
  const gender = useWatch({ control, name: "gender" });
  const selectedServices = useWatch({ control, name: "services" });
  const selectedVisitTypes = useWatch({ control, name: "visitTypes" });
  const payments = useWatch({ control, name: "payments" });
  const selectedTime = useWatch({ control, name: "time" });

  const { data: sale } = useSale(id, {
    enabled: isEdit,
  });

  const onSuccessCallback = () => {
    reset(defaultValues);
    client.invalidateQueries({
      queryKey: [KEYS.sales.list, date],
    });
    router.push(PATH.SALES);
  };

  const { mutate: createSale } = useCreateSale({
    onSuccess: onSuccessCallback,
  });
  const { mutate: updateSale } = useUpdateSale({
    onSuccess: onSuccessCallback,
  });

  const validateForm = useCallback((data: SaleForm) => {
    const validate = {
      message: "",
      flag: false,
    };

    if (+data.amount === 0) {
      validate.message = "결제 유형을 통해 금액을 입력해주세요.";
    } else if (data.payments.length === 0) {
      validate.message = "결제 유형을 선택해주세요.";
    } else if (!!data.time || !!data.date) {
      if (!data.time) {
        validate.message = "날짜를 입력한 경우 시간을 필수로 선택해주세요.";
      } else if (!data.date) {
        validate.message = "시간을 선택한 경우 날짜를 필수로 입력해주세요.";
      }
    }

    if (validate.message === "") {
      validate.flag = true;
    }

    return validate;
  }, []);

  const onSubmit = useCallback(
    (sale: SaleForm) => {
      const filteredPayments = sale.payments.filter(({ amount }) => !!amount);
      const inputData = {
        date: sale.date,
        time: sale.time,
        amount: sale.amount,
        services: sale.services,
        description: sale.description,
        gender: sale.gender,
        payments: filteredPayments,
        visitTypes: sale.visitTypes,
      };

      const { message, flag: valid } = validateForm(inputData);

      if (valid) {
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
          visitTypes: inputData.visitTypes,
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

  const setAmountToEmptyPayment = useCallback(
    (targetId: string) => {
      const selectedService = serviceTypes.find(
        (service) => service.id === targetId
      );

      if (selectedService) {
        const newPayments = [...payments];
        const emptyAmountPayments = newPayments.find(
          ({ amount }) => amount === ""
        );

        if (emptyAmountPayments) {
          emptyAmountPayments.amount = selectedService.price?.toString() ?? "";
        } else if (newPayments.length > 0) {
          const firstPayment = newPayments[0];
          const selectedServicePrice = selectedService.price ?? 0;
          const addedPrice = +firstPayment.amount + selectedServicePrice;
          firstPayment.amount = addedPrice.toString();
        }

        setValue("payments", newPayments);
      }
    },
    [payments, serviceTypes, setValue]
  );

  const handleTypesChange = useCallback(
    (type: "services" | "visitTypes", targetId: string, checked: boolean) => {
      const selectedTypes =
        type === "services" ? selectedServices : selectedVisitTypes;

      const newTypes = selectedTypes.includes(targetId)
        ? selectedTypes.filter((typeId) => typeId !== targetId)
        : [...selectedTypes, targetId];

      setValue(type, newTypes);

      if (type === "services" && checked) {
        setAmountToEmptyPayment(targetId);
      }
    },
    [selectedServices, selectedVisitTypes, setValue, setAmountToEmptyPayment]
  );

  const handleSelectTime = useCallback(
    (time: string) => {
      const isSameTime = selectedTime === time;

      isTouchTime.current = true;
      setValue("time", isSameTime ? "" : time);
      setTimeAccordion("");
    },
    [selectedTime, setValue]
  );

  const isSubmitButtonDisabled = useMemo(() => {
    const hasError = Object.keys(formState.errors).length > 0;
    return formState.isSubmitting || hasError;
  }, [formState]);

  useEffect(
    function setPreviousSales() {
      if (isEdit && sale) {
        isTouchTime.current = true;
        reset({
          id: sale.id,
          amount: sale.amount,
          services: sale.services.map(({ id }) => id),
          gender: sale.gender,
          payments: sale.payments,
          description: sale.description ?? "",
          visitTypes: sale.visitTypes.map(({ id }) => id),
          time: dayjs(sale.date).format("HH:mm"),
          date: formatDate({ date: sale.date }),
        });
      }
    },
    [isEdit, sale, reset]
  );

  useEffect(
    function setTotalAmount() {
      const totalAmount = payments.reduce(
        (prev, { amount }) => prev + +amount,
        0
      );
      setValue("amount", `${totalAmount}`);
    },
    [payments, setValue]
  );

  useEffect(
    function setDefaultPayment() {
      if (!isEdit && paymentTypes.length !== 0) {
        const newPayments = [
          {
            typeId: paymentTypes[0].id,
            name: paymentTypes[0].name,
            amount: "",
          },
        ];
        setValue("payments", newPayments);
      }
    },
    [isEdit, paymentTypes, setValue]
  );

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">{title}</h2>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle className="flex gap-2 items-center">
                <span className="text-sm text-gray-500">총 매출액</span>
                <span className="text-[20px] tracking-wide">
                  {Number(amount).toLocaleString()}원
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
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
                <PaymentTypes isEdit={isEdit} payments={payments} />
              </div>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="serviceTypes">
                  <AccordionTrigger>서비스 유형</AccordionTrigger>
                  <AccordionContent>
                    <ServiceTypes
                      selectedServices={selectedServices}
                      onChangeTypes={handleTypesChange}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Accordion
                type="single"
                collapsible
                className="w-full"
                value={timeAccordion}
                onValueChange={setTimeAccordion}
              >
                <AccordionItem value="time">
                  <AccordionTrigger>
                    <RequiredLabel
                      {...(isTouchTime.current && { value: selectedTime })}
                    >
                      시간 선택
                    </RequiredLabel>
                  </AccordionTrigger>
                  <AccordionContent>
                    <TimeSelectField
                      selectedTime={selectedTime}
                      onClickSelect={handleSelectTime}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="serviceTypes">
                  <AccordionTrigger>성별</AccordionTrigger>
                  <AccordionContent>
                    <GenderSelectField
                      gender={gender}
                      onClickSelect={(gender) => setValue("gender", gender)}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="isFirst">
                  <AccordionTrigger>
                    <RequiredLabel>방문 유형</RequiredLabel>
                  </AccordionTrigger>
                  <AccordionContent className="flex gap-2 items-center">
                    <VisitTypes
                      selectedVisitTypes={selectedVisitTypes}
                      onChangeTypes={handleTypesChange}
                    />
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
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitButtonDisabled}
              >
                매출 등록
              </Button>
            </CardContent>
          </Card>
        </form>
      </FormProvider>
    </div>
  );
};

export default SaleEditPage;
