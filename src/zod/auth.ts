import { z } from "zod";
export const zLogin = z.object({
  emailId: z.email("Invalid email format").trim().toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});
export const zSignUp = z.object({
  firstName: z
    .string({ error: "First name is required" })
    .min(4, "First name must be at least 4 characters")
    .max(40, "First name cannot exceed 40 characters")
    .trim(),
  lastName: z.string().max(40).trim().optional(),
  emailId: z.email("Invalid email format").trim().toLowerCase(),
  password: z
    .string({ error: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  age: z.number().min(1, "Please enter the age"),
  gender: z.enum(["male", "female", "others"]),
  about: z.string().optional(),
  skills: z
    .array(z.string())
    .max(10, { message: "You can have a maximum of 10 skills" }),
});
