const { z } = require("zod");
const zSignUp = z.object({
  firstName: z
    .string()
    .min(4, "First name must be at least 4 characters")
    .max(40, "First name cannot exceed 40 characters")
    .trim(),
  lastName: z.string().max(40).trim().optional(),
  emailId: z.email("Invalid email format").trim().toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  age: z.number().min(18, "You must be at least 18 years old").optional(),
  gender: z.enum(["male", "female", "others"]).optional(),
  about: z.string().max(200, "About section cannot exceed 200 characters"),
  photoUrl: z.url("Invalid image URL").optional(),
  skills: z
    .array(z.string().trim().min(1))
    .max(15, "You can add a maximum of 15 skills")
    .optional(),
});
module.exports = zSignUp;
