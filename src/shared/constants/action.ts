import { MutateType } from "../types/query";

export const ACTION: Record<MutateType, MutateType> = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
} as const;
