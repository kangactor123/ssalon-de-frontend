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
import { useCreateVisitType } from "@/queries/settings";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  afterCreateVisitType: () => void;
};

const CreateVisitTypesDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  afterCreateVisitType,
}) => {
  const [name, setName] = useState("");

  const { mutate: createVisitType } = useCreateVisitType({
    onSuccess: () => {
      resetForm();
      onOpenChange(false);
      afterCreateVisitType();
    },
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      createVisitType(name);
    },
    [name, createVisitType]
  );

  const resetForm = useCallback(() => {
    setName("");
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>방문 유형 추가</DialogTitle>
          <DialogDescription>
            새로운 방문 유형을 입력해주세요.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid items-center grid-cols-4 gap-4">
              <Label htmlFor="name" className="text-right">
                유형
              </Label>
              <Input
                id="name"
                placeholder="신규"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" size="sm">
              추가
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default memo(CreateVisitTypesDialog);
