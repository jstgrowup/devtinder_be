import { z } from "zod";

export const inputSchema = z.object({
  amount: z.coerce.number().int().min(1),
  plan: z.enum(["base", "super-boost"]),
});
export type ISubscriptionBody = z.infer<typeof inputSchema>;
export const requiresAuth = true;
