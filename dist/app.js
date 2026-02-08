import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth";
import profileRouter from "./routes/profile";
import requestRouter from "./routes/request";
import { connectDB } from "./config/database.js";
var app = express();
// This has taken the json and converted it to JS object and added this into the req body
app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
connectDB()
    .then(function () {
    app.listen(8000, function () {
        console.log("Server started on 8000 and Database connected");
    });
})
    .catch(function () {
    console.log("Database did not connected Successfully");
});
