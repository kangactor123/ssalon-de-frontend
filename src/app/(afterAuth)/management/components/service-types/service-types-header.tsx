"use client";

import { memo, useCallback, useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/shared/ui/button";

import CreateServiceTypesDialog from "./create-service-types-dialog";
import PageTitle from "@/shared/ui/page-title";
import { revalidatePath } from "next/cache";

const ServiceTypesHeader = () => {
  const [openDialog, setOpenDialog] = useState(false);

  const afterMutateServiceType = useCallback(() => {
    revalidatePath("/management");
  }, []);

  return (
    <div className="flex items-center justify-between">
      <PageTitle title="서비스 유형" />
      <Button onClick={() => setOpenDialog(true)}>
        <Plus className="w-4 h-4 mr-2" />
        생성
      </Button>
      <CreateServiceTypesDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        afterCreateServiceType={afterMutateServiceType}
      />
    </div>
  );
};

export default memo(ServiceTypesHeader);
