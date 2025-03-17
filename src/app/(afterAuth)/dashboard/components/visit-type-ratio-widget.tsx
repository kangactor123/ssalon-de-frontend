"use client";

import { useVisitTypesRatio } from "@/queries/dashboard";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import EmptyWidget from "./empty-widget";
import PieChart from "@/shared/ui/pie-chart";
import { renderActiveShape } from "./pie-chart-active-shape";
import { customLegend } from "./pie-chart-custom-legend";
import { formatDate } from "@/shared/utils/dayjs";
import { YEAR_MONTH } from "@/shared/constants/dayjs-format";
import dayjs from "dayjs";

export function VisitTypesRatioWidget() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  const { data } = useVisitTypesRatio(
    formatDate({ date: dayjs(), format: YEAR_MONTH })
  );
  const handlePieEnter = (_: unknown, index: number) => {
    setActiveIndex(index);
  };

  const chartData = useMemo(
    () =>
      data
        ? Object.entries(data).map(([name, value]) => ({
            name,
            value,
          }))
        : [],
    [data]
  );

  const isEmpty = Object.values(data ?? {}).every((value) => !value);

  if (isEmpty) {
    return <EmptyWidget onClick={() => router.push("/sales/edit")} />;
  }

  return (
    <PieChart
      dataKey="value"
      activeShape={renderActiveShape}
      data={chartData}
      onMouseEnter={handlePieEnter}
      activeIndex={activeIndex}
      customLegend={customLegend}
    />
  );
}
