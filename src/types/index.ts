import { Request } from "express";
import mongoose from "mongoose";
import z from "zod";
import { REQUEST_STATUS } from "../utils/enums";
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
export interface IConnectionRequest {
  fromUserId: mongoose.Types.ObjectId;
  toUserId: mongoose.Types.ObjectId;
  status: REQUEST_STATUS;
}
