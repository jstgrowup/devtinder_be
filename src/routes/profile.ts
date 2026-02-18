import { Router, Response } from "express";
import { AuthenticatedRequest } from "../types/index.js";

import { zEditProfile } from "../zod/profile.js";
const router = Router();
import { fromError } from "zod-validation-error";
import { authMiddleware } from "../middlewares/auth.js";
router.get(
  "/me",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.user;
      res.send({ data: user });
    } catch (error) {
      res
        .status(400)
        .json({ message: "Something went wrong while getting the user" });
    }
  },
);
router.patch(
  "/edit",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const body = req.body;
      const user = req.user;
      const validatedResult = zEditProfile.parse(body);
      Object.assign(user, validatedResult);
      await user.save();
      res.json({ message: "Profile updated successfully" });
    } catch (error) {
      const validationError = fromError(error).toString();
      if (validationError) {
        res.status(400).json({ message: validationError });
      } else {
        res.status(400).json("Something went wrong while updating the profile");
      }
    }
  },
);
export default router;
