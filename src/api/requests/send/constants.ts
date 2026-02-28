import z from "zod";
import { zObjectId } from "../../../types";

export const inputSchema = z.object({
  status: z.enum(["ignore", "interested", "accepted", "rejected"]),
  toUserId: zObjectId,
});
export type IConnectionRequestPayload = z.infer<typeof inputSchema>;

export const requiresAuth = true;
