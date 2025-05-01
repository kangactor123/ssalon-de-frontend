import type { ServiceType } from "@/queries/settings/type";
import { SERVICE_TYPES_KEY } from "@/shared/constants/query-keys";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { Label } from "@/shared/ui/label";
import Spinner from "@/shared/ui/spinner";
import { useQueryClient } from "@tanstack/react-query";
import { LucideRotateCw } from "lucide-react";
import React from "react";

type ServiceTypeProps = {
  id: string;
  isChecked: boolean;
  name: string;
  price: number;
  onChangeTypes: (
    type: "visitTypes" | "services",
    id: string,
    checked: boolean
  ) => void;
};

const ServiceType: React.FC<ServiceTypeProps> = (props) => {
  const { id, isChecked, name, price, onChangeTypes } = props;
  return (
    <div key={id} className="flex items-center space-x-2 min-h-[36px]">
      <Checkbox
        id={`service-${id}`}
        checked={isChecked}
        onCheckedChange={(state) => onChangeTypes("services", id, !!state)}
      />
      <Label htmlFor={`service-${id}`}>
        {name}
        {!!price && (
          <span className="ml-1">{`(${price.toLocaleString()}원)`}</span>
        )}
      </Label>
    </div>
  );
};

const MemoizedServiceType = React.memo(ServiceType);

type Props = {
  isLoading: boolean;
  serviceTypes: ServiceType[];
  selectedServices: string[];
  isError: boolean;
  onChangeTypes: (
    type: "visitTypes" | "services",
    id: string,
    checked: boolean
  ) => void;
};

const ServiceTypes: React.FC<Props> = (props) => {
  const queryClient = useQueryClient();
  const { serviceTypes, selectedServices, isLoading, isError, onChangeTypes } =
    props;

  const isEmpty = serviceTypes.length === 0;

  const onClickReload = (event: React.SyntheticEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    queryClient.invalidateQueries({
      queryKey: SERVICE_TYPES_KEY,
    });
  };

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <p className="text-gray-500 text-xs text-center mb-2">
          등록된 서비스가 존재하지 않습니다.
        </p>
        <p className="text-gray-500 text-xs text-center">
          만약 서비스가 존재한다면 아래 새로고침 버튼을 클릭해주세요.
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

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <p className="text-gray-500 text-xs">서비스를 불러오지 못했습니다.</p>
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Spinner />
      </div>
    );
  }
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {serviceTypes.map((service) => {
        return (
          <MemoizedServiceType
            key={service.id}
            id={service.id}
            isChecked={selectedServices.includes(service.id)}
            name={service.name}
            price={service.price ?? 0}
            onChangeTypes={onChangeTypes}
          />
        );
      })}
    </div>
  );
};

export default ServiceTypes;
