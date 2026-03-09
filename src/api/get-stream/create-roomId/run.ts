import { Room } from "../../../models/Call";
import { IMongoContext } from "../../../types";
import { ICreateCallType } from "./constants";

export default async function run(
  { toUserId }: ICreateCallType,
  context: IMongoContext,
) {
  const existingRoom = await Room.findOne({
    fromUserId: context.user._id,
    toUserId,
  });
  if (existingRoom) {
    return { data: `chat-${existingRoom._id}` };
  }
  const call = await Room.create({ fromUserId: context.user._id, toUserId });
  return { data: `chat-${call._id}` };
}
