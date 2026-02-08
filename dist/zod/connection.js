import { z } from "zod";
export var zConnectionRequest = z.object({
    status: z.enum(["ignore", "interested", "accepted", "rejected"]),
});
