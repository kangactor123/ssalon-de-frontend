"use client";

import { Gender } from "@/queries/sales/type";
import { Label } from "@/shared/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import { memo } from "react";

type Props = {
  gender: Gender;
  onClickSelect: (gender: Gender) => void;
};

const genderItems = [
  { label: "남성", value: "M" },
  { label: "여성", value: "F" },
];

const GenderSelectField: React.FC<Props> = ({ gender, onClickSelect }) => {
  return (
    <RadioGroup
      value={gender}
      onValueChange={(value) => onClickSelect(value as Gender)}
      className="flex gap-4"
      required
    >
      {genderItems.map(({ label, value }) => (
        <div key={value} className="flex items-center space-x-2">
          <RadioGroupItem value={value} id={`gender-${value}`} />
          <Label htmlFor={`gender-${value}`}>{label}</Label>
        </div>
      ))}
    </RadioGroup>
  );
};

export default memo(GenderSelectField);
