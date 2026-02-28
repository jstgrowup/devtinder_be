import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const getAuthenticatedUser = async (cookies: { token: string }) => {
  const { token } = cookies;

  if (!token) {
    throw new Error("Invalid token");
  }

  const decoded = jwt.verify(token, "DEV@TINDER") as { _id: string };
  const user = await User.findById(decoded._id);

  if (!user) {
    throw new Error("User does not exist");
  }

  return user;
};
