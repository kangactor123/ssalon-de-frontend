"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import useDateStore from "@/zustand/date";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { Button } from "@/shared/ui/button";
import { formatDate } from "@/shared/utils/dayjs";
import { WEEKDAYS_KOR, YEAR_MONTH_KOR } from "@/shared/constants/dayjs-format";

export default function Calendar() {
  const today = dayjs();
  const { setDate, date } = useDateStore();
  const [selectedDate, setSelectedDate] = useState(dayjs(date) ?? today);
  const [currentDate, setCurrentDate] = useState(dayjs(date) ?? today);

  const daysInMonth = currentDate.daysInMonth();

  const firstDayOfMonth = useMemo(
    () => Array.from({ length: currentDate.startOf("month").day() }),
    [currentDate]
  );

  const dates = Array.from({ length: daysInMonth });

  const prevMonth = () => {
    setCurrentDate(currentDate.subtract(1, "month").startOf("month"));
  };

  const nextMonth = () => {
    setCurrentDate(currentDate.add(1, "month").startOf("month"));
  };

  const isToday = (date: Dayjs) => {
    return today.isSame(date, "date");
  };

  const isSelected = (date: Dayjs) => {
    return date.isSame(selectedDate, "date");
  };

  useEffect(() => {
    setDate(formatDate({ date: selectedDate }));
  }, [setDate, selectedDate]);

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevMonth}
          aria-label="Previous month"
        >
          <ChevronLeft size={20} />
        </Button>
        <span className="font-semibold text-gray-700">
          {formatDate({ date: currentDate, format: YEAR_MONTH_KOR })}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={nextMonth}
          aria-label="Next month"
        >
          <ChevronRight size={20} />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS_KOR.map((day) => (
          <div key={day} className="text-xs font-semibold text-gray-500">
            {day}
          </div>
        ))}
        {firstDayOfMonth.map((_, index) => (
          <div key={`empty-${index}`} />
        ))}
        {dates.map((_, index) => {
          const date = dayjs(currentDate)
            .startOf("month")
            .set("date", index + 1);
          return (
            <div
              key={formatDate({ date })}
              className={`text-sm p-1 rounded-full transition-colors cursor-pointer ${
                isSelected(date)
                  ? "bg-blue-500 text-white"
                  : isToday(date)
                  ? "bg-blue-100 text-blue-600"
                  : "hover:bg-blue-100"
              }`}
              onClick={() => setSelectedDate(date)}
            >
              {index + 1}
            </div>
          );
        })}
      </div>
    </div>
  );
}
