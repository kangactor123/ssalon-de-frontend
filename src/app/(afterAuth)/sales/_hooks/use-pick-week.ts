import { useState } from "react";
import dayjs from "dayjs";
import useDateStore from "@/zustand/date";

const usePickWeek = () => {
  const date = useDateStore((state) => state.date);
  const [selectedWeek, setSelectedWeek] = useState(dayjs(date).startOf("week"));

  const handleClickPreviousWeek = () => {
    const previousWeek = dayjs(selectedWeek).subtract(1, "week");
    setSelectedWeek(previousWeek.startOf("week"));
  };

  const handleClickNextWeek = () => {
    const nextWeek = dayjs(selectedWeek).add(1, "week");
    setSelectedWeek(nextWeek.startOf("week"));
  };

  return {
    selectedWeek,
    onClickPreviousWeek: handleClickPreviousWeek,
    onClickNextWeek: handleClickNextWeek,
  };
};

export default usePickWeek;
