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
import { FieldPath, RegisterOptions, useForm } from "react-hook-form";

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

const Settings = () => {
  const [open, setOpen] = useState("");
  const { toast } = useToast();
  const { data = [] } = useSettings();
  const { register, formState, handleSubmit, reset } = useForm<FormData>({
    defaultValues: { goal: "" },
    mode: "onChange",
  });
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
      const dto: Setting[] = Object.entries(data).map(([name, value]) => ({
        name,
        value,
      }));
      editSettings(dto);
    }
  };

  useEffect(() => {
    if (data.length > 0) {
      const resetValues = data.reduce((prev, cur) => {
        const findItem = prev[cur.name];
        if (!findItem) {
          prev[cur.name] = "";
        }
        prev[cur.name] = cur.value;
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
    </form>
  );
};

export default Settings;
