"use client";

import { useMemo } from "react";
import dayjs, { Dayjs } from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useWindowSize } from "react-use";

import { YEAR_MONTH_DAY } from "@/shared/constants/dayjs-format";
import { Button } from "@/shared/ui/button";
import { getDevice } from "@/shared/utils/device-size";
import useDateStore from "@/zustand/date";

import usePickWeek from "../_hooks/use-pick-week";

const DatePicker = () => {
  const date = useDateStore((state) => state.date);
  const setDate = useDateStore((state) => state.setDate);

  const { width } = useWindowSize();
  const { selectedWeek, onClickNextWeek, onClickPreviousWeek } = usePickWeek();

  const thisWeekDays = useMemo(() => {
    const device = getDevice(width);
    const arrayLength = device === "desktop" ? 10 : 7;
    return Array.from({ length: arrayLength }, (_, i) =>
      selectedWeek.add(i, "day")
    );
  }, [selectedWeek, width]);

  const isFutureDate = (date: Dayjs) => dayjs(date).isAfter(dayjs(), "day");

  return (
    <div className="md:mt-[24px] md:gap-8 flex items-center justify-center gap-1 px-2">
      <Button onClick={onClickPreviousWeek} size="sm" variant="ghost">
        <ChevronLeft className="w-4 h-4" />
      </Button>
      <div className="sm:gap-4 flex items-center justify-center gap-1">
        {thisWeekDays.map((day) => (
          <Button
            size="roundedIcon"
            key={day.format(YEAR_MONTH_DAY)}
            variant={day.isSame(date, "day") ? "default" : "ghost"}
            onClick={() => setDate(day.format(YEAR_MONTH_DAY))}
            disabled={isFutureDate(day)}
            className="text-xs"
          >
            {day.get("date")}
          </Button>
        ))}
      </div>
      <Button onClick={onClickNextWeek} size="sm" variant="ghost">
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default DatePicker;
