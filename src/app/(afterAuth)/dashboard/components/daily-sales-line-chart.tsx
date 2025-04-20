"use client";

import { useDailySalesAmountCount } from "@/queries/dashboard";
import { Line, XAxis, Tooltip, LineChart, YAxis } from "recharts";
import EmptyWidget from "./empty-widget";
import { useRouter } from "next/navigation";
import { CHART_COLORS } from "@/shared/constants/palette";

import { ChartContainer, type ChartConfig } from "@/shared/ui/chart";
import { formatDate } from "@/shared/utils/dayjs";
import { YEAR_MONTH } from "@/shared/constants/dayjs-format";
import dayjs from "dayjs";
import useDateStore from "@/zustand/date";
import { memo } from "react";

const chartConfig = {
  count: {
    label: "매출 건",
    color: CHART_COLORS[0],
  },
} satisfies ChartConfig;

function DailySalesLineChart() {
  const date = useDateStore((state) => state.date);
  const router = useRouter();
  const { data = [] } = useDailySalesAmountCount(
    formatDate({ date: dayjs(date), format: YEAR_MONTH })
  );

  if (data.length === 0) {
    return <EmptyWidget onClick={() => router.push("/sales/edit")} />;
  }

  return (
    <ChartContainer config={chartConfig}>
      <LineChart accessibilityLayer data={data}>
        <XAxis dataKey="date" />
        <YAxis yAxisId="count" dataKey="count" />
        <Line
          yAxisId="count"
          dataKey="count"
          fill="var(--color-count)"
          radius={4}
        />
        <Tooltip />
      </LineChart>
    </ChartContainer>
  );
}

export default memo(DailySalesLineChart);
