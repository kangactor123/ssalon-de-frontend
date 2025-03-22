"use client";

import {
  Accordion,
  AccordionTrigger,
  AccordionItem,
  AccordionContent,
} from "@/shared/ui/accordion";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import PageTitle from "@/shared/ui/page-title";
import { RequiredLabel } from "@/shared/ui/required-label";
import { useEditSettings, useSettings } from "@/queries/settings";
import { Setting } from "@/queries/settings/type";
import { useToast } from "@/shared/hooks/use-toast";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { FieldPath, RegisterOptions, useForm, useWatch } from "react-hook-form";
import BadgeCustom from "./badge-custom";
import { BADGE_TYPE } from "@/shared/constants/badge-type";
import { ColorKey } from "@/shared/types/palette";
import useBadgeCustomStore from "@/zustand/badge-custom";

type FormData = Record<string, string>;
type Form = {
  label: string;
  placeholder: string;
  options: RegisterOptions;
} & Omit<Setting, "value">;

const settings: Form[] = [
  {
    name: "goal",
    label: "목표 매출",
    placeholder: "목표 금액을 입력해주세요.",
    options: {
      required: true,
      pattern: {
        value: /^\d*$/,
        message: "숫자만 입력할 수 있습니다.",
      },
    },
  },
];

const defaultValues: FormData = {
  goal: "",
  paymentType: "",
  visitType: "",
  serviceType: "",
  gender: "",
};

const Settings = () => {
  const [open, setOpen] = useState("");
  const { toast } = useToast();
  const { data = [] } = useSettings();
  const setBadgeCustom = useBadgeCustomStore((state) => state.setBadgeCustom);
  const { register, formState, handleSubmit, reset, setValue, control } =
    useForm<FormData>({
      defaultValues,
      mode: "onChange",
    });

  const {
    serviceType = "",
    gender = "",
    paymentType = "",
    visitType = "",
  } = useWatch({ control });

  const { mutate: editSettings } = useEditSettings({
    onSuccess: () => {
      toast({ description: "저장 완료!" });
      setOpen("");
    },
    onError: () => {
      toast({
        description: "저장 실패! 다시 시도해주세요.",
        variant: "destructive",
      });
    },
  });

  const handleSave = (data: FormData) => {
    if (formState.isValid) {
      const dto: Setting[] = [];
      const badgeTypes = Object.keys(BADGE_TYPE);
      const customColor: Record<keyof typeof BADGE_TYPE, ColorKey | ""> = {
        paymentType: "",
        visitType: "",
        serviceType: "",
        gender: "",
      };

      Object.entries(data).forEach(([name, value]) => {
        if (badgeTypes.includes(name)) {
          customColor[name as keyof typeof BADGE_TYPE] = value as ColorKey;
        } else {
          dto.push({ name, value });
        }
      });

      setBadgeCustom(customColor);
      editSettings([
        ...dto,
        { name: "customBadge", value: JSON.stringify(customColor) },
      ]);
    }
  };

  useEffect(() => {
    if (data.length > 0) {
      const resetValues = data.reduce((prev, cur) => {
        if (cur.name === "customBadge") {
          const customBadge = JSON.parse(cur.value);
          Object.entries(customBadge).forEach(([key, value]) => {
            prev[key] = value as string;
          });
        } else {
          const findItem = prev[cur.name];
          if (!findItem) {
            prev[cur.name] = "";
          }
          prev[cur.name] = cur.value;
        }
        return { ...prev };
      }, {} as FormData);
      reset({ ...resetValues });
    }
  }, [data, reset]);

  return (
    <form
      className="container flex flex-col gap-2"
      onSubmit={handleSubmit(handleSave)}
    >
      <div className="flex justify-between">
        <PageTitle title="설정" />
        <Button
          type="submit"
          size="icon"
          variant="outline"
          disabled={!formState.isValid}
        >
          <Save className="w-4 h-4" />
        </Button>
      </div>
      {settings.map(({ name, label, placeholder, options }) => {
        return (
          <Accordion
            key={name}
            type="single"
            collapsible
            className="w-[100%]"
            value={open}
            onValueChange={setOpen}
          >
            <AccordionItem value={name}>
              <AccordionTrigger>
                <RequiredLabel
                  required
                  errorMessage={
                    formState.errors[name as FieldPath<FormData>]?.message
                  }
                >
                  {label}
                </RequiredLabel>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-1">
                  <Input
                    {...register(name, options)}
                    id={name}
                    placeholder={placeholder}
                    isError={!!formState.errors[name as FieldPath<FormData>]}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        );
      })}
      <Accordion
        type="single"
        collapsible
        className="w-[100%]"
        value={open}
        onValueChange={setOpen}
      >
        <AccordionItem value="badge-color">
          <AccordionTrigger>
            <RequiredLabel>뱃지 색상 커스텀</RequiredLabel>
          </AccordionTrigger>
          <AccordionContent>
            <BadgeCustom
              onChangeColor={(key, color) => setValue(key, color)}
              value={{
                paymentType,
                visitType,
                serviceType,
                gender,
              }}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </form>
  );
};

export default Settings;
