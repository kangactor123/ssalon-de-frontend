import { useSettings } from "@/queries/settings";
import useBadgeCustomStore from "@/zustand/badge-custom";
import { useEffect } from "react";
import { SETTING_MAP } from "../constants/setting";
import { BadgeType } from "../types/badge-type";
import { ColorKey } from "../types/palette";

export const useInitCustomBadge = () => {
  const { data = [] } = useSettings();
  const setBadgeCustom = useBadgeCustomStore((state) => state.setBadgeCustom);

  useEffect(() => {
    const findCustomBadge = data.find(
      ({ name }) => name === SETTING_MAP.customBadge
    );

    if (findCustomBadge) {
      const { value } = findCustomBadge;
      const customBadge = JSON.parse(value) as Record<BadgeType, ColorKey | "">;
      setBadgeCustom(customBadge);
    }
  }, [data, setBadgeCustom]);
};
