import { create } from "zustand";
import dayjs from "dayjs";
import { formatDate } from "@/shared/utils/dayjs";
import { DateStore } from "./type";

export const initialDate = formatDate({ date: dayjs() });

const useDateStore = create<DateStore>((set) => ({
  date: initialDate,
  setDate: (date: string) => set({ date }),
  getMonth: (date: string) => {
    return dayjs(date).get("month") + 1;
  },
}));

export default useDateStore;
