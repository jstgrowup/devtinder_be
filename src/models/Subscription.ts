import mongoose from "mongoose";
import { ISubscription } from "../types";
import { SUBSCRIPTION_PLANS, SUBSCRIPTION_STATUS } from "../utils/enums";

const subscriptionSchema = new mongoose.Schema<ISubscription>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: { type: Number, required: true, min: 100 },
    plan: {
      type: String,
      enum: {
        values: Object.values(SUBSCRIPTION_PLANS),
        message: "{VALUE} is not a valid plan",
      },
    },
    currentPeriodStarts: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    currentPeriodEnds: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    status: {
      type: String,
      enum: Object.values(SUBSCRIPTION_STATUS),
      default: SUBSCRIPTION_STATUS.ACTIVE,
      required: true,
    },
  },
  { timestamps: true },
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
