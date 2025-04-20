export interface DateStates {
  date: string; // format "YYYY-MM-DD"
}

export interface DateActions {
  setDate: (date: string) => void;
  getMonth: (date: string) => number;
}

export interface DateStore extends DateStates, DateActions {}
