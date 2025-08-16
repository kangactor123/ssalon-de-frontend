"use client";

import { memo, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/shared/ui/button";

import PageTitle from "@/shared/ui/page-title";
import CreatePaymentTypesDialog from "./create-payment-type-dialog";

const PaymentTypesHeader = () => {
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);

  const afterMutatePaymentType = useCallback(() => {
    router.refresh();
  }, [router]);

  return (
    <div className="flex items-center justify-between">
      <PageTitle>결제 유형</PageTitle>
      <Button onClick={() => setOpenDialog(true)}>
        <Plus className="w-4 h-4 mr-2" />
        생성
      </Button>
      <CreatePaymentTypesDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        afterCreatePaymentType={afterMutatePaymentType}
      />
    </div>
  );
};

export default memo(PaymentTypesHeader);
