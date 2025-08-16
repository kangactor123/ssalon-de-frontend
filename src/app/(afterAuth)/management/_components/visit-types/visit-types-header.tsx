"use client";

import { memo, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/shared/ui/button";

import PageTitle from "@/shared/ui/page-title";
import CreateVisitTypesDialog from "./create-visit-types-dialog";

const VisitTypesHeader = () => {
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);

  const afterMutateVisitType = useCallback(() => {
    router.refresh();
  }, [router]);

  return (
    <div className="flex items-center justify-between">
      <PageTitle>방문 유형</PageTitle>
      <Button onClick={() => setOpenDialog(true)}>
        <Plus className="w-4 h-4 mr-2" />
        생성
      </Button>
      <CreateVisitTypesDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        afterCreateVisitType={afterMutateVisitType}
      />
    </div>
  );
};

export default memo(VisitTypesHeader);
