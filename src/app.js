const express = require("express");
const connectDB = require("./config/database");
const UserModel = require("./models/User");
const app = express();
// This has taken the json and converted it to JS object and added this into the req body
app.use(express.json());
app.post("/sign-up", async (req, res) => {
  try {
    const body = req.body;
    // New instance of the user model
    const user = new UserModel(body);
    await user.save();
    res.send("User created successfully");
  } catch (error) {
    res.status(400).send("Something went wrong while creating the user");
  }
});

app.get("/feed", async (req, res) => {
  try {
    // New instance of the user model
    const users = await UserModel.find({});
    res.send(users);
  } catch (error) {
    res.status(400).send("Something went wrong while creating the user");
  }
});
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    // New instance of the user model
    await UserModel.findByIdAndDelete(userId);
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
    const user = await UserModel.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
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
