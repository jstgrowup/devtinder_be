import z from "zod";

export const inputSchema = z.object({
  emailId: z.email("Invalid email format").trim().toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});
export type ILoginPayload = z.infer<typeof inputSchema>;

export const requiresAuth = false;
