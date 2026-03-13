import { IContext } from "../../../types";
import { ConnectionRequest } from "../../../models/ConnectionRequest";
import { REQUEST_STATUS } from "../../../utils/enums";
import { IConnectionsPaginationPayload } from "./constants";

export default async function run(
  payload: IConnectionsPaginationPayload,
  context: IContext,
) {
  const userId = context.user._id;
  const { page, limit } = payload;
  const skip = (page - 1) * limit;

  const connectionRequests = await ConnectionRequest.find({
    $or: [
      { toUserId: userId, status: REQUEST_STATUS.ACCEPTED },
      { fromUserId: userId, status: REQUEST_STATUS.ACCEPTED },
    ],
  })
    .populate("fromUserId", [
      "firstName",
      "lastName",
      "photoUrl",
      "age",
      "gender",
      "about",
      "skills",
    ])
    .populate("toUserId", [
      "firstName",
      "lastName",
      "photoUrl",
      "age",
      "gender",
      "about",
      "skills",
    ])
    .skip(skip)
    .limit(limit)
    .lean();

  const data = connectionRequests.map((row) => {
    if (row.fromUserId._id.toString() === userId.toString()) {
      return row.toUserId;
    }
    return row.fromUserId;
  });

  return {
    data,
  };
}
