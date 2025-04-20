"use client";

import { Button } from "@/shared/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";

import { Calendar } from "@/shared/ui/calendar";
import { memo } from "react";
import { useCalendar } from "@/shared/hooks/use-calendar";

const MonthPicker = () => {
  const { selectedDate, onChangeDate, today } = useCalendar();

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
          onSelect={onChangeDate}
          defaultMonth={selectedDate}
          disabled={{ after: today }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default memo(MonthPicker);
