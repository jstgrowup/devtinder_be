import z from "zod";

export const inputSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});
export type IFeedPaginationPayload = z.infer<typeof inputSchema>;

export const requiresAuth = true;
