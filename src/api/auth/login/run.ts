import { User } from "../../../models/User";
import { ILoginPayload } from "../../../zod/auth";

export default async function run(data: ILoginPayload) {
  // Check if user exists
  const foundUser = await User.findOne({
    emailId: data.emailId,
  });
  if (!foundUser) throw new Error("User doesn't not exists");
  const validatedPassword = await foundUser.validatePass(data.password);
  // Hash & Save
  if (validatedPassword) {
    // Create a token
    const token = await foundUser.getJwt();
    return { user: foundUser, token };
  }
  throw new Error("Wrong password");
}
