import { TOKEN } from "../constants/token";

export type TokenType = (typeof TOKEN)[keyof typeof TOKEN];
