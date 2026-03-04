import { StreamChat } from "stream-chat";
import { IMongoContext } from "../../../types";
import { ICreateTokenBodyType } from "./constants";

const serverClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY,
  process.env.STREAM_API_SECRET,
);
export default async function run(
  data: ICreateTokenBodyType,
  context: IMongoContext,
) {
  const userID = data.toUserId;
  const token = serverClient.createToken(userID.toString());

  return { data: token };
}
