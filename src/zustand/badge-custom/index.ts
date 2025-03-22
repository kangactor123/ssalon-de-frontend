import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BadgeCustom, BadgeCustomPersist } from "./type";

const key = "badge-custom-store";

export const initialBadgeCustom: BadgeCustom = {
  payment: "",
  genderType: "",
  serviceType: "",
  visitType: "",
};

const useBadgeCustomStore = create(
  (persist as unknown as BadgeCustomPersist)(
    (set) => ({
      badgeCustom: initialBadgeCustom,
      setBadgeCustom: (badgeCustom) => set({ badgeCustom }),
    }),
    {
      name: key,
      partialize: (state) => ({ badgeCustom: state.badgeCustom }),
    }
  )
);

export default useBadgeCustomStore;
