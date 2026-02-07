const express = require("express");
const router = express.Router();
const { z } = require("zod");
const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const { fromError } = require("zod-validation-error");
const { zSignUp, zLogin } = require("../zod");
router.post("/sign-up", async (req, res) => {
  try {
    const body = req.body;
    // Data Validations
    const validatedResult = zSignUp.parse(body);
    const hashedPassword = await bcrypt.hash(validatedResult.password, 10);
    // New instance of the user model
    const user = new User({ ...validatedResult, password: hashedPassword });
    await user.save();
    res.send("User created successfully");
  } catch (error) {
    const validationError = fromError(error).toString();
    if (validationError) {
      res.status(400).send(validationError);
    } else {
      res.status(400).send("Something went wrong while creating the user");
    }
  }
});
router.post("/login", async (req, res) => {
  try {
    const body = req.body;
    // Data Validations
    const validatedData = zLogin.parse(body);
    const foundUser = await User.findOne({
      emailId: validatedData.emailId,
    });

    if (!foundUser) {
      res.status(401).send("Invalid credentials");
    }

    const validatedPassword = foundUser.validatePass(validatedData.password);

    if (validatedPassword) {
      // Create a token
      const token = foundUser.getJwt();
      // Add the token to cookie and send the response back to the user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });

      res.send("Login Successfull");
    } else {
      res.status(400).send("Invalid credentials");
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }));
      res.status(400).send(errors[0].message);
    } else {
      res
        .status(400)
        .send("Something went wrong while creating the user" + error.message);
    }
  }
});
module.exports = router;
