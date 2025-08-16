import { Button } from "@/shared/ui/button";
import { memo } from "react";

type Props = {
  onClick?: () => void;
  buttonLabel?: string;
  description?: string;
};

const EmptyWidget: React.FC<Props> = ({
  onClick,
  buttonLabel = "생성하기",
  description = "매출을 생성해주세요.",
}) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-3">
      <p className="text-lg text-gray-500">데이터가 존재하지 않습니다.</p>
      <p className="text-sm text-gray-700">{description}</p>
      {onClick && (
        <Button size="sm" variant="outline" onClick={onClick}>
          {buttonLabel}
        </Button>
      )}
    </div>
  );
};

export default memo(EmptyWidget);
