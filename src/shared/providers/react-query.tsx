"use client";
import type * as React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/shared/utils/react-query";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
