"use client";

import { memo, useCallback, useMemo, useState } from "react";

import { useDeleteSale, useSales } from "@/queries/sales";
import { MutateType } from "@/shared/types/query";

import useDateStore from "@/zustand/date";
import { useQueryClient } from "@tanstack/react-query";
import { KEYS } from "@/shared/constants/query-keys";
import { SalesFilter } from "./sales-filter";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/shared/ui/alert-dialog";
import { formatDate } from "@/shared/utils/dayjs";
import { ACTION } from "@/shared/constants/action";
import SalesList from "./sales-list";
import { PATH } from "@/shared/constants/path";
import useSelectedFiltersStore from "@/zustand/selected-filter";

const SalesContainer = () => {
  const client = useQueryClient();
  const router = useRouter();
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [selectedSale, setSelectedSale] = useState<string>();
  const selectedFilters = useSelectedFiltersStore(
    (state) => state.selectedFilters
  );
  const getFilteredSales = useSelectedFiltersStore(
    (state) => state.getFilteredSales
  );
  const { date } = useDateStore();

  const {
    data: sales = [],
    isLoading,
    isFetching,
  } = useSales(
    {
      date: formatDate({ date }),
    },
    {
      enabled: !!date,
    }
  );

  const { mutate: deleteSale } = useDeleteSale({
    onSuccess: () => onAfterMutate(ACTION.DELETE),
  });

  const loading = isLoading || isFetching;

  const filteredSales = useMemo(
    () => getFilteredSales(sales),
    [sales, selectedFilters, getFilteredSales]
  );

  const onAfterMutate = useCallback(
    (type: MutateType) => {
      client.invalidateQueries({
        queryKey: [KEYS.sales.list],
      });

      if (type === ACTION.DELETE) {
        setOpenDeleteAlert(false);
      }

      setSelectedSale(undefined);
    },
    [client]
  );

  const handleAction = useCallback(
    (type: MutateType) => async (id: string) => {
      setSelectedSale(id);

      if (type === ACTION.DELETE) {
        setOpenDeleteAlert(true);
      } else if (type === ACTION.UPDATE) {
        client.invalidateQueries({
          queryKey: [KEYS.filters],
        });
        router.push(`${PATH.SALES_EDIT}?saleId=${id}`);
      }
    },
    [router, client]
  );

  const handleConfirmDelete = useCallback(() => {
    if (selectedSale) {
      deleteSale(selectedSale);
    }
  }, [selectedSale, deleteSale]);

  return (
    <>
      <SalesFilter />
      <div className="space-y-4">
        <SalesList
          isEmpty={sales.length === 0}
          isLoading={loading}
          sales={filteredSales}
          onClickSaleDelete={handleAction(ACTION.DELETE)}
          onClickSaleEdit={handleAction(ACTION.UPDATE)}
        />
      </div>
      <ConfirmDialog
        open={openDeleteAlert}
        setOpen={setOpenDeleteAlert}
        onConfirm={handleConfirmDelete}
        title="매출 삭제"
        description="이 매출 기록을 삭제하시겠습니까? 이 작업은 취소할 수 없습니다."
        confirmText="삭제"
      />
    </>
  );
};

export default memo(SalesContainer);
