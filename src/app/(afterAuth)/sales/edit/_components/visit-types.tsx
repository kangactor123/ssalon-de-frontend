import { useVisitTypes } from "@/queries/settings";
import { VISIT_TYPES_KEY } from "@/shared/constants/query-keys";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { Label } from "@/shared/ui/label";
import Spinner from "@/shared/ui/spinner";
import { useQueryClient } from "@tanstack/react-query";
import { LucideRotateCw } from "lucide-react";
import React, { useCallback } from "react";

type VisitTypeProps = {
  id: string;
  name: string;
  checked: boolean;
  onChangeTypes: (
    type: "visitTypes" | "services",
    id: string,
    checked: boolean
  ) => void;
};

const VisitType: React.FC<VisitTypeProps> = (props) => {
  const { id, name, checked, onChangeTypes } = props;
  return (
    <div key={id} className="flex items-center space-x-2">
      <Checkbox
        id={`visitTypes${id}`}
        checked={checked}
        onCheckedChange={(checked) => {
          onChangeTypes("visitTypes", id, !!checked);
        }}
      />
      <Label htmlFor={`visitTypes${id}`}>{name}</Label>
    </div>
  );
};

const MemoizedVisitType = React.memo(VisitType);

type Props = {
  selectedVisitTypes: string[];
  onChangeTypes: (
    type: "visitTypes" | "services",
    id: string,
    checked: boolean
  ) => void;
};

const VisitTypes: React.FC<Props> = (props) => {
  const { data: visitTypes = [], isFetching, isError } = useVisitTypes();

  const queryClient = useQueryClient();
  const { selectedVisitTypes, onChangeTypes } = props;

  const isEmpty = visitTypes.length === 0;

  const onClickReload = useCallback(
    (event: React.SyntheticEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      queryClient.invalidateQueries({
        queryKey: VISIT_TYPES_KEY,
      });
    },
    [queryClient]
  );

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <p className="text-gray-500 text-xs text-center mb-2">
          등록하신 방문 유형이 존재하지 않습니다.
        </p>
        <p className="text-gray-500 text-xs text-center">
          등록한 방문 유형이 존재한다면 아래 새로고침 버튼을 클릭해주세요.
        </p>
        <Button
          size="sm"
          type="button"
          className="mt-2"
          variant="outline"
          onClick={onClickReload}
        >
          <LucideRotateCw className="text-gray-500" />
        </Button>
      </div>
    );
  }

  if (isFetching) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <p className="text-gray-500 text-xs">
          방문 유형을 불러오지 못했습니다.
        </p>
        <Button
          size="sm"
          type="button"
          className="mt-2"
          variant="outline"
          onClick={onClickReload}
        >
          <LucideRotateCw className="text-gray-500" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full grid grid-cols-2 gap-4">
      {visitTypes.map(({ id, name }) => (
        <MemoizedVisitType
          key={id}
          id={id}
          name={name}
          checked={selectedVisitTypes.includes(id)}
          onChangeTypes={onChangeTypes}
        />
      ))}
    </div>
  );
};

export default VisitTypes;
