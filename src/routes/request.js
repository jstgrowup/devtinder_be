const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.js");
const ConnectionRequest = require("../models/ConnectionRequest.js");
const { zConnectionRequest } = require("../zod");
const { fromError } = require("zod-validation-error");
router.post(
  "/send/interested/:status/:toUserId",
  authMiddleware,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const validatedBody = zConnectionRequest.parse({ status });
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status: validatedBody.status,
      });
      await connectionRequest.save();
      res.send("Connection Request sent successfully");
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
module.exports = router;
