import bcrypt from "bcrypt";
import { User } from "../../../models/User";
import { ISignupPayload } from "../../../zod/auth";

export default async function run({
  emailId,
  password,
  firstName,
  lastName,
}: ISignupPayload) {
  // Check if user exists
  const existingUser = await User.findOne({ emailId });
  if (existingUser) throw new Error("User already exists");

  // Hash & Save
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    firstName,
    lastName,
    emailId,
    password: hashedPassword,
  });

  await user.save();
  const token = await user.getJwt();

  return { user, token };
}
