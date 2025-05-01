import { TOKEN } from "@/shared/constants/token";

export type TokenType = (typeof TOKEN)[keyof typeof TOKEN];
