import { Response, Router } from "express";
import { AuthenticatedRequest } from "../types";
const router = Router();
import { fromError } from "zod-validation-error";
import { zConnectionRequest } from "../zod/connection";
import { User } from "../models/User";
import { ConnectionRequest } from "../models/ConnectionRequest";
import { authMiddleware } from "../middlewares/auth";
router.post(
  "/send/interested/:status/:toUserId",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const validatedBody = zConnectionRequest.parse({ status });
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).send("Sorry user doesn't exists");
      }
      // If the connection request already exists between the two users than throw error
      const foundConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (foundConnectionRequest) {
        return res.status(400).send("Sorry connection request already exists");
      }
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status: validatedBody.status,
      });
      await connectionRequest.save();
      return res.send("Connection Request sent successfully");
    } catch (error) {
      const validationError = fromError(error).toString();
      if (validationError) {
        res.status(400).send(validationError.toString());
      } else {
        res.status(400).send("Something went wrong while creating the user");
      }
    }
  },
);
export default router;
