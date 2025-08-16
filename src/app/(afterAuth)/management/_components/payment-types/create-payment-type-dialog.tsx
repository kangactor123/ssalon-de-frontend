"use client";

import { memo, useCallback, useState } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { useCreatePaymentType } from "@/queries/settings";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  afterCreatePaymentType: () => void;
};

const CreatePaymentTypeDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  afterCreatePaymentType,
}) => {
  const [name, setName] = useState("");

  const { mutate: createPaymentType } = useCreatePaymentType({
    onSuccess: () => {
      resetForm();
      onOpenChange(false);
      afterCreatePaymentType();
    },
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      createPaymentType({ name });
    },
    [name, createPaymentType]
  );

  const resetForm = useCallback(() => {
    setName("");
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 결제 유형 추가</DialogTitle>
          <DialogDescription>
            새로운 결제 유형의 정보를 입력하세요.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="name" className="text-right">
                결제 유형
              </Label>
              <Input
                id="name"
                placeholder="카드결제"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">추가</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default memo(CreatePaymentTypeDialog);
