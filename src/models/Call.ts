import mongoose from "mongoose";
import { ICall } from "../types";

const roomSchema = new mongoose.Schema<ICall>(
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

export const Room = mongoose.model("Room", roomSchema);
