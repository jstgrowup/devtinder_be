const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.js");
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("Something went wrong while creating the user");
  }
});
module.exports = router;
