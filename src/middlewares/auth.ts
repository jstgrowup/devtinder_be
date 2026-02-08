import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types";

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid token");
    }
    const { _id } = (await jwt.verify(token, "DEV@TINDER")) as {
      _id: string;
    };
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not exists");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("Unauthorized request");
  }
};
