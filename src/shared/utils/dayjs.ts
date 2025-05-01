import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { YEAR_MONTH_DAY } from "@/shared/constants/dayjs-format";

dayjs.extend(utc);
dayjs.extend(timezone);

export const toUTC = (date: string | Dayjs) => {
  return dayjs.tz(date, "Asia/Seoul").utc();
};

type FormatDateProps = {
  date?: string | Dayjs | Date;
  format?: string;
};
export const formatDate = ({
  date,
  format = YEAR_MONTH_DAY,
}: FormatDateProps) => {
  return dayjs(date).format(format);
};
