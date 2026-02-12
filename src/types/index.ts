import { Request } from "express";
import z from "zod";
export interface AuthenticatedRequest extends Request {
  user: any;
}
export interface IUser {
  firstName: string;
  lastName?: string;
  emailId: string;
  password: string;
  age?: number;
  gender?: "male" | "female" | "others";
  about: string;
  photoUrl: string;
  skills: string[];
}
export const zNumberFromStringNullable = z
  .string()
  .nullable()
  .default(null)
  .transform((val) => (val != null ? Number(val) : null));
