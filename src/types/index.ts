import { Request } from "express";
import mongoose, { HydratedDocument } from "mongoose";
import z from "zod";
import {
  RAZORPAY_PAYMENT_STATUS,
  REQUEST_STATUS,
  SUBSCRIPTION_PLANS,
  SUBSCRIPTION_STATUS,
} from "../utils/enums";
export interface AuthenticatedRequest extends Request {
  user: any;
}
export interface IUser {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName?: string;
  emailId: string;
  password: string;
  age?: number;
  gender?: "male" | "female" | "others";
  about: string;
  photoUrl: string;
  skills: string[];
  isPremiumUser: boolean;
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
export type IMongoContext = {
  user: HydratedDocument<IUser>;
};
export type IContext = {
  user: IUser;
};
export const zObjectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ObjectId format." });

export interface IPayment {
  userId: mongoose.Types.ObjectId;
  orderId: string;
  amount: number;
  recipt?: string;
  status: RAZORPAY_PAYMENT_STATUS;
  plan: SUBSCRIPTION_PLANS;
}
export interface ISubscription {
  userId: mongoose.Types.ObjectId;
  amount: number;
  plan: SUBSCRIPTION_PLANS;
  currentPeriodStarts: Date;
  currentPeriodEnds: Date;
  status: SUBSCRIPTION_STATUS;
}
export interface ICall {
  fromUserId: mongoose.Types.ObjectId;
  toUserId: mongoose.Types.ObjectId;
}
