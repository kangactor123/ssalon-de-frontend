"use client";

import { useVisitTypesRatio } from "@/queries/dashboard";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import EmptyWidget from "./empty-widget";
import PieChart from "@/shared/ui/pie-chart";
import { renderActiveShape } from "./pie-active-shape";
import { customLegend } from "./pie-custom-legend";

export function VisitTypesRatioWidget() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  const { data } = useVisitTypesRatio(dayjs().format("YYYY-MM"));
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
