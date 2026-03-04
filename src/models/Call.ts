import mongoose from "mongoose";
import { ICall, ISubscription } from "../types";

const callSchema = new mongoose.Schema<ICall>(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export const Call = mongoose.model("Call", callSchema);
