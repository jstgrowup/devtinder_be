import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth";
import profileRouter from "./routes/profile";
import requestRouter from "./routes/request";
import userRouter from "./routes/user";
import cors from "cors";
import { connectDB } from "./config/database";
import dotenv from "dotenv";
const app = express();
dotenv.config();
app.use(
  cors({
    origin: `${process.env.FRONTEND_HOST}:3000`,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Hello World, from express");
});
app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/user", userRouter);

connectDB()
  .then(() => {
    app.listen(8000, () => {
      console.log("Server started on 8000 and Database connected");
    });
  })
  .catch(() => {
    console.log("Database did not connected Successfully");
  });
