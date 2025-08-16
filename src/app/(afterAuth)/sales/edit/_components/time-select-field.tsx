"use client";

import { Button } from "@/shared/ui/button";
import { memo, useMemo } from "react";

type Props = {
  selectedTime: string;
  onClickSelect: (time: string) => void;
};

const TimeSelectField: React.FC<Props> = ({ selectedTime, onClickSelect }) => {
  const timeSlots = useMemo(
    () =>
      Array.from({ length: 27 }, (_, i) => {
        const hour = Math.floor(i / 2) + 9;
        const minute = i % 2 === 0 ? "00" : "30";
        return `${hour.toString().padStart(2, "0")}:${minute}`;
      }),
    []
  );

  return (
    <div className="grid grid-cols-4 gap-2">
      {timeSlots.map((time) => (
        <Button
          key={time}
          type="button"
          variant={selectedTime === time ? "default" : "outline"}
          onClick={() => onClickSelect(time)}
        >
          {time}
        </Button>
      ))}
    </div>
  );
};

export default memo(TimeSelectField);
