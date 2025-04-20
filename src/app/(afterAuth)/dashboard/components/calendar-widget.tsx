"use client";

import { memo, useState } from "react";
import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";
import updateLocale from "dayjs/plugin/updateLocale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useMonthlySales } from "@/queries/dashboard";
import useDateStore from "@/zustand/date";
import { useRouter } from "next/navigation";
import { formatDate } from "@/shared/utils/dayjs";
import {
  MONTHS_KOR,
  WEEKDAYS_KOR,
  YEAR_MONTH,
  YEAR_MONTH_KOR,
} from "@/shared/constants/dayjs-format";

dayjs.extend(localeData);
dayjs.extend(updateLocale);
dayjs.updateLocale("ko", {
  months: MONTHS_KOR,
  weekdays: WEEKDAYS_KOR.map((day) => `${day}요일`),
  weekdaysShort: WEEKDAYS_KOR,
});

function CalendarWidget() {
  const router = useRouter();
  const { setDate } = useDateStore();
  const [currentDate, setCurrentDate] = useState(dayjs());
  const { data: monthlySales = [] } = useMonthlySales(
    formatDate({ format: YEAR_MONTH, date: currentDate })
  );

  const daysInMonth = Array.from(
    { length: currentDate.daysInMonth() },
    (_, i) => {
      const date = currentDate.startOf("month").add(i, "day");
      const sale = monthlySales.find((sale) =>
        dayjs(sale.date).isSame(date, "day")
      );
      return {
        date,
        amount: sale ? sale.amount : null,
      };
    }
  );

  const prevMonth = () => setCurrentDate(currentDate.subtract(1, "month"));
  const nextMonth = () => setCurrentDate(currentDate.add(1, "month"));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {formatDate({ date: currentDate, format: YEAR_MONTH_KOR })}
        </h2>
        <div className="space-x-2">
          <Button onClick={prevMonth} size="icon" variant="outline">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button onClick={nextMonth} size="icon" variant="outline">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {WEEKDAYS_KOR.map((day) => (
          <div key={day} className="font-semibold text-center">
            {day}
          </div>
        ))}
        {daysInMonth.map(({ date, amount }, index) => {
          const isToday = date.isSame(dayjs(), "day");
          return (
            <div
              key={date.toString()}
              className={`aspect-square p-1 text-center flex flex-col justify-between cursor-pointer ${
                isToday ? "bg-blue-100" : ""
              }`}
              style={{
                gridColumnStart: index === 0 ? date.day() + 1 : "auto",
              }}
              onClick={() => {
                setDate(formatDate({ date }));
                router.push("/sales");
              }}
            >
              <div
                className={`font-semibold ${isToday ? "text-blue-500" : ""}`}
              >
                {date.format("D")}
              </div>
              {isToday || !date.isAfter(dayjs(), "day") ? (
                <div className="text-[7px] md:text-[10px] text-orange-500 break-words font-bold">
                  {amount?.toLocaleString()}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default memo(CalendarWidget);
