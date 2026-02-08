import { z } from "zod";
export const zConnectionRequest = z.object({
  status: z.enum(["ignore", "interested", "accepted", "rejected"]),
});
