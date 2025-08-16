import { BADGE_TYPE } from "@/shared/constants/badge-type";
import { COLOR_MAP } from "@/shared/constants/palette";
import { ColorKey } from "@/shared/types/palette";
import { RequiredLabel } from "@/shared/ui/required-label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { cn } from "@/shared/utils/tailwind";
import { memo } from "react";

const colorCustomSettings = [
  {
    key: BADGE_TYPE.paymentType,
    label: "결제 유형",
  },
  {
    key: BADGE_TYPE.visitType,
    label: "방문 유형",
  },
  {
    key: BADGE_TYPE.serviceType,
    label: "서비스 유형",
  },
  {
    key: BADGE_TYPE.gender,
    label: "성별 유형",
  },
];

const colors = Object.keys(COLOR_MAP) as ColorKey[];

type Props = {
  value: Record<string, string>;
  onChangeColor: (key: string, color: string) => void;
};

const BadgeCustom: React.FC<Props> = ({ onChangeColor, value }) => {
  return (
    <div className="p-1 flex flex-col gap-2">
      {colorCustomSettings.map(({ key, label }) => (
        <div className="flex gap-2" key={key}>
          <RequiredLabel className="text-gray-400">{label}</RequiredLabel>
          <Select
            value={value[key]}
            onValueChange={(value) => onChangeColor(key, value)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder={label} />
            </SelectTrigger>
            <SelectContent>
              {colors.map((color) => (
                <SelectItem key={`payment${color}`} value={color}>
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full inline-block mr-2",
                      COLOR_MAP[color]
                    )}
                  />
                  <span>{color}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
};

export default memo(BadgeCustom);
