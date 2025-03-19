import { create } from "zustand";
import { EditSettingIdStore } from "./type";

const useEditSettingsIdStore = create<EditSettingIdStore>((set) => ({
  editSettingId: "",
  setEditSettingId: (id) => set({ editSettingId: id }),
}));

export default useEditSettingsIdStore;
