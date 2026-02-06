const express = require("express");
const { z } = require("zod");
const connectDB = require("./config/database");
const User = require("../src/models/User.js");
const bcrypt = require("bcrypt");
const app = express();
const { zSignUp, zLogin } = require("./zod/index.js");
// This has taken the json and converted it to JS object and added this into the req body
app.use(express.json());
app.post("/sign-up", async (req, res) => {
  try {
    const body = req.body;
    // Data Validations
    const validatedData = zSignUp.parse(body);
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    console.log("hashedPassword:", hashedPassword);
    // New instance of the user model
    const user = new User({ ...validatedData, password: hashedPassword });
    await user.save();
    res.send("User created successfully");
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
app.post("/login", async (req, res) => {
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

    const validatedPassword = await bcrypt.compare(
      validatedData.password,
      foundUser.password,
    );
    if (validatedPassword) {
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
app.get("/feed", async (req, res) => {
  try {
    // New instance of the user model
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    console.log("error:", error);
    res.status(400).send("Something went wrong while creating the user");
  }
});
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    // New instance of the user model
    await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (error) {
    res.status(400).send("Something went wrong while deleting the user");
  }
});
app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    // New instance of the user model
    // It ignores the userId
    const user = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send(user);
  } catch (error) {
    res.status(400).send("Something went wrong while updated the user");
  }
});
connectDB()
  .then(() => {
    app.listen(8000, () => {
      console.log("Server started on 8000 and Database connected");
    });
  })
  .catch(() => {
    console.log("Database did not connected Successfully");
  });
