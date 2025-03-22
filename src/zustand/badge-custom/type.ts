import { BadgeType } from "@/shared/types/badge-type";
import { ColorKey } from "@/shared/types/palette";

export type BadgeCustom = Record<BadgeType, ColorKey | "">;

export interface BadgeCustomStates {
  badgeCustom: BadgeCustom;
}

export interface BadgeCustomActions {
  setBadgeCustom: (badgeCustom: BadgeCustom) => void;
  resetBadgeCustom: () => void;
}

export interface BadgeCustomStore
  extends BadgeCustomStates,
    BadgeCustomActions {}
