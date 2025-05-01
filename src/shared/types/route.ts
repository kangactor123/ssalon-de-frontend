import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { PATH } from "@/shared/constants/path";

export type Route = {
  path: string;
  label: string;
  icon?: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
};

export type PathValue = (typeof PATH)[keyof typeof PATH];
