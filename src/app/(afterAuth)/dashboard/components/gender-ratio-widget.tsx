"use client";

import { useGenderRatio } from "@/queries/dashboard";
import { GenderRatio } from "@/queries/dashboard/type";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import EmptyWidget from "./empty-widget";
import PieChart from "@/shared/ui/pie-chart";
import { renderActiveShape } from "./pie-chart-active-shape";
import { customLegend } from "./pie-chart-custom-legend";
import { formatDate } from "@/shared/utils/dayjs";
import { YEAR_MONTH } from "@/shared/constants/dayjs-format";
import dayjs from "dayjs";

export function GenderRatioWidget() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const { data } = useGenderRatio(
    formatDate({ date: dayjs(), format: YEAR_MONTH })
  );

  const handlePieEnter = (_: unknown, index: number) => {
    setActiveIndex(index);
  };

  const chartData = useMemo(
    () =>
      data
        ? Object.keys(data).map((gender) => ({
            name: gender === "male" ? "남성" : "여성",
            value: data[gender as keyof GenderRatio],
          }))
        : [],
    [data]
  );

  const COLORS = ["#8884d8", "#82ca9d"];

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
      colors={COLORS}
      customLegend={customLegend}
    />
  );
}
