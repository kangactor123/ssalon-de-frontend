import { BadgeType } from "@/shared/types/badge-type";
import { ColorKey } from "@/shared/types/palette";
import { StateCreator } from "zustand";
import { PersistOptions } from "zustand/middleware";

export type BadgeCustom = Record<BadgeType, ColorKey | "">;

export interface BadgeCustomStates {
  badgeCustom: BadgeCustom;
}

export interface BadgeCustomActions {
  setBadgeCustom: (badgeCustom: BadgeCustom) => void;
}

export type BadgeCustomPersist = (
  config: StateCreator<BadgeCustomStore>,
  options: PersistOptions<BadgeCustomStates>
) => StateCreator<BadgeCustomStore>;

export interface BadgeCustomStore
  extends BadgeCustomStates,
    BadgeCustomActions {}
