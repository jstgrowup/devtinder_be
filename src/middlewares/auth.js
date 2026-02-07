const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const authMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid token");
    }
    const { _id } = await jwt.verify(token, "DEV@TINDER");
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
module.exports = authMiddleware;
