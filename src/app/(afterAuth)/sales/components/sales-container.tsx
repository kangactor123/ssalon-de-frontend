"use client";

import { memo, useCallback, useMemo, useState } from "react";

import { useDeleteSale, useSales } from "@/queries/sales";
import { MutateType } from "@/shared/types/query";

import useDateStore from "@/zustand/date";
import { useQueryClient } from "@tanstack/react-query";
import { KEYS } from "@/shared/constants/query-keys";
import { SalesFilter } from "./sales-filter";
import { useRouter } from "next/navigation";
import { Filter } from "@/shared/types/filter";
import { ConfirmDialog } from "@/shared/ui/alert-dialog";
import { formatDate } from "@/shared/utils/dayjs";
import { BADGE_TYPE } from "@/shared/constants/badge-type";
import { ACTION } from "@/shared/constants/action";
import SalesList from "./sales-list";
import { PATH } from "@/shared/constants/path";

const SalesContainer = () => {
  const client = useQueryClient();
  const router = useRouter();
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [selectedSale, setSelectedSale] = useState<string>();
  const [selectedFilters, setSelectedFilters] = useState<Filter[]>([]);
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
    () =>
      sales.filter((sale) => {
        const selectedVisitTypes = selectedFilters
          .filter((filter) => filter.type === BADGE_TYPE.visitType)
          .map(({ id }) => id);

        // 방문 유형이 있다면 필터링
        if (selectedVisitTypes.length > 0) {
          return sale.visitTypes.some((visitType) =>
            selectedVisitTypes.includes(visitType.id)
          );
        }

        const selectedServices = selectedFilters
          .filter((filter) => filter.type === BADGE_TYPE.serviceType)
          .map(({ id }) => id);

        // 서비스 타입이 있다면 필터링
        if (selectedServices.length > 0) {
          return sale.services.some((service) =>
            selectedServices.includes(service.id)
          );
        }

        const selectedGenders = selectedFilters
          .filter((filter) => filter.type === BADGE_TYPE.gender)
          .map(({ id }) => id);

        // 성별이 있다면 필터링
        if (selectedGenders.length > 0) {
          return selectedGenders.includes(sale.gender);
        }

        const selectedPaymentTypes = selectedFilters
          .filter((filter) => filter.type === BADGE_TYPE.paymentType)
          .map(({ id }) => id);

        // 결제 유형이 있다면 필터링
        if (selectedPaymentTypes.length > 0) {
          return selectedFilters.some(({ id }) =>
            sale.payments.some(({ typeId }) => typeId === id)
          );
        }

        return true;
      }),
    [sales, selectedFilters]
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

  const toggleFilterType = (filter: Filter) => {
    setSelectedFilters((prev) => {
      if (prev.some(({ id }) => id === filter.id)) {
        return prev.filter((item) => item.id !== filter.id);
      } else {
        return [...prev, filter];
      }
    });
  };

  return (
    <>
      <SalesFilter
        selectedFilters={selectedFilters}
        onToggle={toggleFilterType}
      />
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
