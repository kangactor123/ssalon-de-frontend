"use client";

import usePrefetchFilters from "@/shared/hooks/use-prefetch-filters";
import { Button } from "@/shared/ui/button";
import { Logo } from "@/shared/ui/logo";
import { Menu } from "lucide-react";
import { useEffect } from "react";

type Props = {
  onMenuToggle: () => void;
};

export function MobileHeader({ onMenuToggle }: Props) {
  const { prefetchFilters, isMount } = usePrefetchFilters();

  console.log(isMount);
  useEffect(() => {
    prefetchFilters();
  }, [prefetchFilters]);

  return (
    <header className="fixed top-0 left-0 w-full flex items-center justify-between p-4 bg-white border-b md:hidden h-[70px] z-50">
      <Logo />
      <Button variant="ghost" size="icon" onClick={onMenuToggle}>
        <Menu className="h-6 w-6" />
      </Button>
    </header>
  );
}
