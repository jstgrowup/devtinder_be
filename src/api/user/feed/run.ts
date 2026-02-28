import { IContext } from "../../../types";
import { ConnectionRequest } from "../../../models/ConnectionRequest";
import { IFeedPaginationPayload } from "./constants";
import { User } from "../../../models/User";

export default async function run(
  payload: IFeedPaginationPayload,
  context: IContext,
) {
  const { page, limit } = payload;
  const loggedInUserId = context.user._id;
  const skip = (page - 1) * limit;
  // Find all the requests that i have sent or recieved
  const connectionRequests = await ConnectionRequest.find({
    $or: [{ toUserId: loggedInUserId }, { fromUserId: loggedInUserId }],
  }).select("fromUserId toUserId");
  const hideUsersFromFeed = new Set<string>();
  connectionRequests.forEach((req) => {
    hideUsersFromFeed.add(req.fromUserId.toString());
    hideUsersFromFeed.add(req.toUserId.toString());
  });
  const users = await User.find({
    $and: [
      { _id: { $nin: Array.from(hideUsersFromFeed) } },
      { _id: { $ne: loggedInUserId } },
    ],
  })
    .select("firstName lastName photoUrl age gender about skills about")
    .skip(skip)
    .limit(limit);
  return {
    data: users,
  };
}
