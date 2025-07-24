"use client";

import { useCreateBulkSale } from "@/queries/sales";
import { ERROR_MESSAGE } from "@/shared/constants/error-message";
import { PATH } from "@/shared/constants/path";
import { KEYS } from "@/shared/constants/query-keys";
import { useToast } from "@/shared/hooks/use-toast";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardFooter } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import PageTitle from "@/shared/ui/page-title";
import useDateStore from "@/zustand/date";
import { useQueryClient } from "@tanstack/react-query";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";

type BulkSale = {
  amount: number;
};

type Form = {
  date: string;
  bulkSales: BulkSale[];
};

const defaultValues: Form = {
  date: "",
  bulkSales: [{ amount: 0 }],
};

const BulkPage = () => {
  const { toast } = useToast();
  const router = useRouter();
  const client = useQueryClient();
  const date = useDateStore((state) => state.date);
  const { control, handleSubmit, reset } = useForm<Form>({
    defaultValues: {
      ...defaultValues,
      date: date,
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "bulkSales",
    rules: {
      minLength: {
        value: 1,
        message: ERROR_MESSAGE.NEED_MINIMUM_ONE_SALE.message,
      },
    },
  });

  const appendField = () => {
    append(
      { amount: 0 },
      {
        shouldFocus: true,
      }
    );
  };

  const removeField = (index: number) => {
    if (fields.length === 1) {
      return toast({
        description: ERROR_MESSAGE.NEED_MINIMUM_ONE_SALE.message,
        variant: "destructive",
      });
    }

    remove(index);
  };

  const isLastIndex = (index: number) => {
    return index === fields.length - 1;
  };

  const handleClickSave = (formData: Form) => {
    const bulkSales = formData.bulkSales.map((sale) => sale.amount);
    createBulkSales({
      date: formData.date,
      bulkSales,
    });
  };

  return (
    <form
      className="container flex flex-col gap-4"
      onSubmit={handleSubmit(handleClickSave)}
    >
      <PageTitle className="flex justify-between">
        매출 다중 입력
        <Button>저장</Button>
      </PageTitle>
      <div className="grid md:grid-cols-2 gap-4">
        {fields.map((field, index) => (
          <Card key={field.id}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Label className="w-12" htmlFor={`bulkSales.${index}.amount`}>
                  금액
                </Label>
                <Input
                  {...control.register(`bulkSales.${index}.amount`, {
                    required: true,
                  })}
                  key={`bulkSale.${index}.amount`}
                  placeholder="금액"
                />
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
                onClick={() => removeField(index)}
              >
                <TrashIcon className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </form>
  );
};

export default BulkPage;
