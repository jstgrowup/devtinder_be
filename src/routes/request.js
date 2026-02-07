const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.js");
router.post("/send-connection-request", authMiddleware, async (req, res) => {
  try {
    res.send("sent");
  } catch (error) {
    console.log("error:", error);
    res.status(400).send("Something went wrong while creating the user");
  }
});
module.exports = router;
