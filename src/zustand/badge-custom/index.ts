import { create } from "zustand";
import { BadgeCustom, BadgeCustomStore } from "./type";

export const initialBadgeCustom: BadgeCustom = {
  paymentType: "",
  gender: "",
  serviceType: "",
  visitType: "",
};

const useBadgeCustomStore = create<BadgeCustomStore>((set) => ({
  badgeCustom: initialBadgeCustom,
  setBadgeCustom: (badgeCustom) => set({ badgeCustom }),
  resetBadgeCustom: () => set({ badgeCustom: initialBadgeCustom }),
}));

export default useBadgeCustomStore;
