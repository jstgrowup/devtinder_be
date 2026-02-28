import { IContext } from "../../../types";
import { ConnectionRequest } from "../../../models/ConnectionRequest";
import { REQUEST_STATUS } from "../../../utils/enums";
import { IAcceptRejectPayload } from "./constants";

export default async function run(
  payload: IAcceptRejectPayload,
  context: IContext,
) {
  const userId = context.user._id;
  const requestId = payload.requestId;
  const status = payload.status;
  const connectionRequest = await ConnectionRequest.findOne({
    _id: requestId,
    toUserId: userId,
    status: REQUEST_STATUS.INTERESTED,
  });
  if (!connectionRequest) {
    throw new Error("Sorry invalid request id");
  }
  await connectionRequest.save();
  connectionRequest.status = status;
  return {
    message: `Connection Request ${status} successfully`,
  };
}
