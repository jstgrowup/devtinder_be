import { z } from "zod";
import { REQUEST_STATUS } from "../utils/enums";
export const zConnectionRequest = z.object({
  status: z.enum(["ignore", "interested", "accepted", "rejected"]),
});

export const zAcceptReject = z.object({
  status: z.enum([REQUEST_STATUS.ACCEPTED, REQUEST_STATUS.REJECTED]),
});
