const { z } = require("zod");
const zProfileEdit = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .optional(),
  firstName: z
    .string({ required_error: "First name is required" })
    .min(4, "First name must be at least 4 characters")
    .max(40, "First name cannot exceed 40 characters")
    .trim(),
  lastName: z.string().max(40).trim().optional(),
  photoUrl: z.url("Invalid photo URL").optional(),
  skills: z.array(z.string()).max(10, "You can add up to 10 skills").optional(),
});
module.exports = { zProfileEdit };
