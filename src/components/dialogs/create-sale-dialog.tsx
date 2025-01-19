"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ServiceType = {
  id: string;
  name: string;
  price: number;
};

type NewSale = {
  date: string;
  amount: number;
  serviceTypes: string[];
  customerInfo: string;
};

type NewSaleDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (newSale: NewSale) => void;
};

export function NewSaleDialog({
  open,
  onOpenChange,
  onSubmit,
}: NewSaleDialogProps) {
  const [dateTime, setDateTime] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [customerInfo, setCustomerInfo] = useState("");
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);

  useEffect(() => {
    // In a real application, this would be fetched from an API
    setServiceTypes([
      { id: "1", name: "커트", price: 15000 },
      { id: "2", name: "염색", price: 50000 },
      { id: "3", name: "펌", price: 80000 },
      { id: "4", name: "스타일링", price: 30000 },
    ]);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      date: dateTime,
      amount: parseInt(amount),
      serviceTypes: selectedServices,
      customerInfo,
    });
    resetForm();
  };

  const resetForm = () => {
    setDateTime("");
    setAmount("");
    setSelectedServices([]);
    setCustomerInfo("");
  };

  const handleServiceChange = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const calculateTotalAmount = () => {
    return serviceTypes
      .filter((service) => selectedServices.includes(service.id))
      .reduce((total, service) => total + service.price, 0);
  };

  useEffect(() => {
    setAmount(calculateTotalAmount().toString());
  }, [selectedServices]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 매출 입력</DialogTitle>
          <DialogDescription>새로운 매출 정보를 입력하세요.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dateTime" className="text-right">
                날짜 및 시간
              </Label>
              <Input
                id="dateTime"
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                required
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">서비스 유형</Label>
              <div className="col-span-3 grid grid-cols-2 gap-2">
                {serviceTypes.map((service) => (
                  <div key={service.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`service-${service.id}`}
                      checked={selectedServices.includes(service.id)}
                      onCheckedChange={() => handleServiceChange(service.id)}
                    />
                    <Label htmlFor={`service-${service.id}`}>
                      {service.name} ({service.price.toLocaleString()}원)
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                총 금액
              </Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customerInfo" className="text-right">
                고객 정보
              </Label>
              <Input
                id="customerInfo"
                type="text"
                value={customerInfo}
                onChange={(e) => setCustomerInfo(e.target.value)}
                placeholder="예: 30대 여성, 단골 고객"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">매출 등록</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
