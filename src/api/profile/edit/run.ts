import { IMongoContext } from "../../../types";
import { IEditProfile } from "./constants";

export default async function run(
  payload: IEditProfile,
  context: IMongoContext,
) {
  const user = context.user;
  Object.assign(user, payload);
  await user.save();
  return { message: "Profile updated successfully" };
}
