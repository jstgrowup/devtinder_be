import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { fromError } from "zod-validation-error";
const router = Router();
import { User } from "../models/User.js";
import { zLogin, zSignUp } from "../zod/auth.js";

router.post("/signup", async (req: Request, res: Response) => {
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
router.post("/login", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    // Data Validations
    const validatedData = zLogin.parse(body);
    const foundUser = await User.findOne({
      emailId: validatedData.emailId,
    });

    if (!foundUser) {
      return res
        .status(401)
        .json({ message: "Invalid credentials", success: false });
    }

    const validatedPassword = await foundUser.validatePass(
      validatedData.password,
    );

    if (validatedPassword) {
      // Create a token
      const token = await foundUser.getJwt();
      // Add the token to cookie and send the response back to the user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });

      return res.json({
        message: "Login Successfull",
        data: foundUser,
        success: true,
      });
    } else {
      return res
        .status(400)
        .json({ message: "Invalid credentials", success: false });
    }
  } catch (error) {
    const validationError = fromError(error).toString();
    if (validationError) {
      res.status(400).json({ message: validationError, success: false });
    } else {
      res.status(400).json({
        message: "Something went wrong while creating the user",
        success: true,
      });
    }
  }
});
router.post("/logout", async (req: Request, res: Response) => {
  res
    .cookie("token", null, { expires: new Date(Date.now()) })
    .json({ message: "Logged out successfully" });
});
export default router;
