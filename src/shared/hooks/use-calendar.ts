import useDateStore from "@/zustand/date";
import dayjs from "dayjs";
import { useMemo } from "react";
import { SelectSingleEventHandler } from "react-day-picker";

type Result = {
  selectedDate: Date;
  onChangeDate: SelectSingleEventHandler;
  today: Date;
};

export const useCalendar = (): Result => {
  const today = new Date();
  const setDate = useDateStore((state) => state.setDate);
  const date = useDateStore((state) => state.date);

  const onChangeDate: SelectSingleEventHandler = (day) => {
    if (day && setDate instanceof Function) {
      setDate(dayjs(day).format("YYYY-MM-DD"));
    }
  };

  const selectedDate = useMemo(() => dayjs(date).toDate(), [date]);

  return {
    selectedDate,
    onChangeDate,
    today,
  };
};
