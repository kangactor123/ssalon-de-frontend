import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";

import ServiceTypes from "./_components/service-types";
import PaymentTypes from "./_components/payment-types";
import Settings from "./_components/settings";
import VisitTypes from "./_components/visit-types";

type Content = "settings" | "service-types" | "payment-types" | "visit-types";
type ContentMap = Record<Content, { label: string; content: React.ReactNode }>;

const contents: ContentMap = {
  settings: {
    label: "설정",
    content: <Settings />,
  },
  "payment-types": {
    label: "결제 유형",
    content: <PaymentTypes />,
  },
  "service-types": {
    label: "서비스 유형",
    content: <ServiceTypes />,
  },
  "visit-types": {
    label: "방문 유형",
    content: <VisitTypes />,
  },
};

export default function ManagementPage() {
  return (
    <Tabs defaultValue="settings">
      <TabsList className="mb-2">
        {Object.entries(contents).map(([key, { label }]) => (
          <TabsTrigger key={`trigger${key}`} value={key}>
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
      {Object.entries(contents).map(([key, { content }]) => (
        <TabsContent key={`content${key}`} value={key}>
          {content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
