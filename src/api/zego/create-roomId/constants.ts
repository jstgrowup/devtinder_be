import { z } from "zod";
import { zObjectId } from "../../../types";

export const inputSchema = z.object({
  toUserId: zObjectId,
});

export type ICreateCallType = z.infer<typeof inputSchema>;
export const requiresAuth = true;
