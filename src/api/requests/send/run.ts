import { User } from "../../../models/User";
import { IContext } from "../../../types";
import { ConnectionRequest } from "../../../models/ConnectionRequest";
import { IConnectionRequestPayload } from "./constants";

export default async function run(
  payload: IConnectionRequestPayload,
  context: IContext,
) {
  const fromUserId = context.user._id;
  const toUserId = payload.toUserId;
  const status = payload.status;
  const toUser = await User.findById(toUserId);
  if (!toUser) {
    throw new Error("Sorry user doesn't exists");
  }
  const foundConnectionRequest = await ConnectionRequest.findOne({
    $or: [
      { fromUserId, toUserId },
      { fromUserId: toUserId, toUserId: fromUserId },
    ],
  });
  if (foundConnectionRequest) {
    throw new Error("Sorry connection request already exists");
  }
  const connectionRequest = new ConnectionRequest({
    fromUserId,
    toUserId,
    status: status,
  });
  await connectionRequest.save();
  return {
    message: `You have successfully ${status} ${toUser.firstName}`,
  };
}
