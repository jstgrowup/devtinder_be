import { StreamChat } from "stream-chat";
import { ICreateTokenBodyType } from "./constants";
import { IMongoContext } from "../../../types";
import { User } from "../../../models/User";

const serverClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY,
  process.env.STREAM_API_SECRET,
);
export default async function run(
  data: ICreateTokenBodyType,
  context: IMongoContext,
) {
  const toUserId = data.toUserId;
  const toUserDetails = await User.findById(toUserId);
  const userID = context.user._id;
  await serverClient.upsertUsers([
    {
      id: userID.toString(),
      name: context.user.firstName,
      image: context.user.photoUrl,
    },
    {
      id: toUserId.toString(),
      name: toUserDetails.firstName,
      image: toUserDetails.photoUrl,
    },
  ]);
  const token = serverClient.createToken(userID.toString());

  return { data: token };
}
