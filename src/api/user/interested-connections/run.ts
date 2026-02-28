import { IContext } from "../../../types";
import { ConnectionRequest } from "../../../models/ConnectionRequest";
import { REQUEST_STATUS } from "../../../utils/enums";

export default async function run({}, context: IContext) {
  const userId = context.user._id;
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
    ]);
  return {
    data: connectionRequests,
  };
}
