const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.js");
const { zProfileEdit } = require("../zod");
const { fromError } = require("zod-validation-error");
router.get("/view", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("Something went wrong while creating the user");
  }
});
router.patch("/edit", authMiddleware, async (req, res) => {
  try {
    const body = req.body;
    const user = req.user;
    const validatedResult = zProfileEdit.parse(body);
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
});
module.exports = router;
