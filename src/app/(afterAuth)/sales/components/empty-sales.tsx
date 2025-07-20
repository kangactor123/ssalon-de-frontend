"use client";

import { Button } from "@/shared/ui/button";
import Spinner from "@/shared/ui/spinner";
import useDateStore from "@/zustand/date";
import dayjs from "dayjs";
import { Plus } from "lucide-react";
import { memo } from "react";

type Props = {
  isLoading: boolean;
  onClickButton: () => void;
};

const EmptySales: React.FC<Props> = (props) => {
  const { isLoading, onClickButton } = props;
  const date = useDateStore((state) => state.date);

  const displayDate = dayjs(date).format("MM월 DD일");

  return (
    <div className="text-center py-8">
      <div className="text-gray-900 font-bold text-lg">{displayDate}</div>
      <p className="text-lg text-gray-500 mb-4">등록된 매출이 없습니다.</p>
      <Button onClick={onClickButton} disabled={isLoading}>
        {isLoading ? (
          <Spinner className="mr-2" />
        ) : (
          <Plus className="mr-2 h-4 w-4" />
        )}
        등록하기
      </Button>
    </div>
  );
};

export default memo(EmptySales);
