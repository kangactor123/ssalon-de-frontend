import type { ServiceType } from "@/queries/settings/type";
import { Checkbox } from "@/shared/ui/checkbox";
import { Label } from "@/shared/ui/label";
import Spinner from "@/shared/ui/spinner";
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
  onChangeTypes: (
    type: "visitTypes" | "services",
    id: string,
    checked: boolean
  ) => void;
};

const ServiceTypes: React.FC<Props> = (props) => {
  const { serviceTypes, selectedServices, isLoading, onChangeTypes } = props;

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

export default React.memo(ServiceTypes);
