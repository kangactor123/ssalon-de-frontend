export interface States {
  editSettingId: string;
}

export interface Actions {
  setEditSettingId: (id: string) => void;
}

export interface EditSettingIdStore extends States, Actions {}
