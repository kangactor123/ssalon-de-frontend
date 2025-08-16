"use client";

import { ArrowUpFromLineIcon, Plus } from "lucide-react";
import { Button } from "@/shared/ui/button";
import PageTitle from "@/shared/ui/page-title";

import { TotalSales } from "./total-sales";
import { useRouter } from "next/navigation";
import { PATH } from "@/shared/constants/path";
import { useQueryClient } from "@tanstack/react-query";
import { KEYS } from "@/shared/constants/query-keys";

const SalesHeader = () => {
  const router = useRouter();
  const client = useQueryClient();
  const handleClickEdit = () => {
    client.invalidateQueries({
      queryKey: [KEYS.filters],
    });
    router.push(PATH.SALES_EDIT);
  };

  const handleClickBulkCreate = () => {
    router.push(PATH.SALES_BULK_CREATE);
  };
  return (
    <div className="relative flex flex-col items-baseline justify-between gap-6 md:items-center md:flex-row md:gap-0">
      <PageTitle>매출 목록</PageTitle>
      <div className="flex flex-wrap justify-between w-full gap-4 md:w-max md:justify-normal">
        <TotalSales />
        <div className="flex gap-2">
          <Button size="icon" variant="outline" onClick={handleClickBulkCreate}>
            <ArrowUpFromLineIcon className="w-4 h-4" />
          </Button>
          <Button
            onClick={handleClickEdit}
            className="absolute top-0 right-0 md:relative"
          >
            <Plus className="w-4 h-4" />
            매출 등록
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SalesHeader;
