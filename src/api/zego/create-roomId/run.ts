import { Call } from "../../../models/Call";
import { IMongoContext } from "../../../types";
import { ICreateCallType } from "./constants";

export default async function run(
  { toUserId }: ICreateCallType,
  context: IMongoContext,
) {
  const call = await Call.create({ fromUserId: context.user._id, toUserId });
  return { data: `chat-${call._id}` };
}
