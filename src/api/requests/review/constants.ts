import z from "zod";
import { REQUEST_STATUS } from "../../../utils/enums";
import { zObjectId } from "../../../types";

export const inputSchema = z.object({
  status: z.enum([REQUEST_STATUS.ACCEPTED, REQUEST_STATUS.REJECTED]),
  requestId: zObjectId,
});
export type IAcceptRejectPayload = z.infer<typeof inputSchema>;

export const requiresAuth = true;
