import dayjs from "dayjs";
import { SelectSingleEventHandler } from "react-day-picker";

import useDateStore from "@/zustand/date";
import { formatDate } from "@/shared/utils/dayjs";

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
      setDate(formatDate({ date: day }));
    }
  };

  const selectedDate = dayjs(date).toDate();

  return {
    selectedDate,
    onChangeDate,
    today,
  };
};
