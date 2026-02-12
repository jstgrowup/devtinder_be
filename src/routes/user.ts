import { Router, Response } from "express";
import { AuthenticatedRequest } from "../types/index.js";
const router = Router();
import { authMiddleware } from "../middlewares/auth.js";
import { ConnectionRequest } from "../models/ConnectionRequest.js";
import { REQUEST_STATUS } from "../utils/enums.js";
import { User } from "../models/User.js";
router.get(
  "/requests/interested",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user._id;
      const connectionRequests = await ConnectionRequest.find({
        toUserId: userId,
        status: REQUEST_STATUS.INTERESTED,
      }).populate("fromUserId", [
        "firstName",
        "lastName",
        "photoUrl",
        "age",
        "gender",
        "about",
        "skills",
      ]);
      res.json({ data: connectionRequests });
    } catch (error) {
      res.status(400).send("Something went wrong while creating the user");
    }
  },
);
router.get(
  "/requests/connections",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user._id;
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
      res.json({ data: connectionRequests });
    } catch (error) {
      res.status(400).send("Something went wrong while creating the user");
    }
  },
);
router.get(
  "/feed",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const loggedInUserId = req.user._id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

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
      res.json({ data: users });
    } catch (error) {
      res.status(400).send("Something went wrong while creating the user");
    }
  },
);
export default router;
