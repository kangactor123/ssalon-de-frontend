"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
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

type SaleForm = Omit<Sale, "services" | "payments" | "id" | "date"> & {
  date: string;
  time: string;
  services: string[];
  visitTypes: string[];
  payments: Payment[];
  id?: string;
};

const genderItems = [
  { label: "남성", value: "M" },
  { label: "여성", value: "F" },
];

const SaleEditPage = () => {
  const router = useRouter();
  const isTouchTime = useRef(false);
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { date } = useDateStore();

  const id = searchParams.get("saleId") ?? "";
  const isEdit = !!id;
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

  const {
    data: visitTypes = [],
    isFetching: isVisitTypesFetching,
    isError: isVisitTypesError,
  } = useVisitTypes();
  const {
    data: paymentTypes = [],
    isFetching: isPaymentTypesFetching,
    isError: isPaymentTypesError,
  } = usePaymentTypes();
  const {
    data: serviceTypes = [],
    isFetching: isServiceTypesFetching,
    isError: isServiceTypesError,
  } = useServiceTypes();

  // for debugging
  console.log("paymentTypes", paymentTypes);
  console.log("serviceTypes", serviceTypes);
  console.log("visitTypes", visitTypes);

  const { register, handleSubmit, formState, reset, setValue, control } =
    useForm<SaleForm>({
      defaultValues,
      mode: "onChange",
    });

  const amount = useWatch({ control, name: "amount" });
  const gender = useWatch({ control, name: "gender" });
  const selectedServices = useWatch({ control, name: "services" });
  const selectedVisitTypes = useWatch({ control, name: "visitTypes" });
  const payments = useWatch({ control, name: "payments" });
  const selectedTime = useWatch({ control, name: "time" });

  const { data: sale } = useSale(id, {
    enabled: isEdit,
  });

  const [timeAccordion, setTimeAccordion] = useState("");

  const onSuccessCallback = useCallback(() => {
    reset(defaultValues);
    router.push(PATH.SALES);
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
      // return validate;
    } else if (data.payments.length === 0) {
      validate.message = "결제 유형을 선택해주세요.";
      validate.flag = false;
      // return validate;
    } else if (!!data.time || !!data.date) {
      if (!data.time) {
        validate.message = "날짜를 입력한 경우 시간을 필수로 선택해주세요.";
        validate.flag = false;
        // return validate;
      } else if (!data.date) {
        validate.message = "시간을 선택한 경우 날짜를 필수로 입력해주세요.";
        // validate.flag = false;
      }
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

  const handleTypesChange = useCallback(
    (type: "visitTypes" | "services", id: string, checked: boolean) => {
      const selectedTypes =
        type === "visitTypes" ? selectedVisitTypes : selectedServices;

      const newTypes = selectedTypes.includes(id)
        ? selectedTypes.filter((typeId) => typeId !== id)
        : [...selectedTypes, id];

      setValue(type, newTypes);

      if (type === "services" && checked) {
        const selectedService = serviceTypes.find(
          (service) => service.id === id
        );

        if (selectedService) {
          const newPayments = [...payments];
          const emptyAmountPayments = newPayments.find(
            ({ amount }) => amount === ""
          );

          if (emptyAmountPayments) {
            emptyAmountPayments.amount =
              selectedService.price?.toString() ?? "";
          } else if (newPayments.length > 0) {
            const firstPayment = newPayments[0];
            const selectedServicePrice = selectedService.price ?? 0;
            const addedPrice = +firstPayment.amount + selectedServicePrice;
            firstPayment.amount = addedPrice.toString();
          }

          setValue("payments", newPayments);
        }
      }
    },
    [payments, selectedServices, selectedVisitTypes, serviceTypes, setValue]
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
    if (!isEdit && paymentTypes.length > 0) {
      setValue("payments", [
        { typeId: paymentTypes[0].id, name: paymentTypes[0].name, amount: "" },
      ]);
    }
  }, [isEdit, paymentTypes, setValue]);

  useEffect(() => {
    if (isEdit && sale) {
      reset({
        time: dayjs(sale.date).format("HH:mm"),
        date: formatDate({ date: sale.date }),
        amount: sale.amount,
        services: sale.services.map((service) => service.id),
        gender: sale.gender,
        payments: sale.payments,
        description: sale.description ?? "",
        id: sale.id,
        visitTypes: sale.visitTypes.map((visitType) => visitType.id),
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
              <PaymentTypes
                paymentTypes={paymentTypes}
                payments={payments}
                setValue={setValue}
                isEmptyPaymentTypes={paymentTypes.length === 0}
                isError={isPaymentTypesError}
                isLoading={isPaymentTypesFetching}
              />
            </div>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="serviceTypes">
                <AccordionTrigger>서비스 유형</AccordionTrigger>
                <AccordionContent>
                  <ServiceTypes
                    isError={isServiceTypesError}
                    isLoading={isServiceTypesFetching}
                    serviceTypes={serviceTypes}
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
                          isTouchTime.current = true;
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
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="isFirst">
                <AccordionTrigger>
                  <RequiredLabel>방문 유형</RequiredLabel>
                </AccordionTrigger>
                <AccordionContent className="flex gap-2 items-center">
                  <VisitTypes
                    isError={isVisitTypesError}
                    isLoading={isVisitTypesFetching}
                    visitTypes={visitTypes}
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
