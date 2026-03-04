import mongoose from "mongoose";
import { IPayment } from "../types";
import { RAZORPAY_PAYMENT_STATUS, SUBSCRIPTION_PLANS } from "../utils/enums";

const paymentSchema = new mongoose.Schema<IPayment>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: { type: String, required: true },
    amount: { type: Number, required: true, min: 100 },
    recipt: { type: String },
    status: {
      type: String,
      enum: {
        values: Object.values(RAZORPAY_PAYMENT_STATUS),
        message: "{VALUE} is not a valid status",
      },
      default: RAZORPAY_PAYMENT_STATUS.AUTHORIZED,
    },
    plan: {
      type: String,
      enum: {
        values: Object.values(SUBSCRIPTION_PLANS),
        message: "{VALUE} is not a valid plan",
      },
    },
  },
  { timestamps: true },
);

export const Payment = mongoose.model("Payment", paymentSchema);
