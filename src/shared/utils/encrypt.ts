import CryptoJS from "crypto-js";
import { SECRET_KEY } from "../constants/env";

export function encryptPassword(password: string): string {
  return CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
}
