"use client";

import { Button } from "@/shared/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";

import { Calendar } from "@/shared/ui/calendar";
import { memo, useMemo } from "react";
import { SelectSingleEventHandler } from "react-day-picker";
import useDateStore from "@/zustand/date";
import dayjs from "dayjs";

const MonthPicker = () => {
  const today = new Date();
  const setDate = useDateStore((state) => state.setDate);
  const date = useDateStore((state) => state.date);

  const handleChange: SelectSingleEventHandler = (day) => {
    if (day) {
      setDate(dayjs(day).format("YYYY-MM-DD"));
    }
  };

  const selectedDate = useMemo(() => dayjs(date).toDate(), [date]);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="submit" size="icon" variant="outline">
          <CalendarIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="text-[12px] text-center text-gray-500 mb-2">
          선택한 날짜의 월 데이터를 확인할 수 있습니다.
        </div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleChange}
          initialFocus
          disabled={{ after: today }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default memo(MonthPicker);
