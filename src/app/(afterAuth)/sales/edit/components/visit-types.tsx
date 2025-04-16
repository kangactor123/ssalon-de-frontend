import { Checkbox } from "@/shared/ui/checkbox";
import { Label } from "@/shared/ui/label";
import Spinner from "@/shared/ui/spinner";
import React from "react";

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
  isLoading: boolean;
  visitTypes: { id: string; name: string }[];
  selectedVisitTypes: string[];
  onChangeTypes: (
    type: "visitTypes" | "services",
    id: string,
    checked: boolean
  ) => void;
};

const VisitTypes: React.FC<Props> = (props) => {
  const { isLoading, visitTypes, selectedVisitTypes, onChangeTypes } = props;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Spinner />
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

export default React.memo(VisitTypes);
