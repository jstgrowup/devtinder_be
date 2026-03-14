import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./config/database";
import dotenv from "dotenv";
import { getAuthenticatedUser } from "./services/auth";
import { fromZodError } from "zod-validation-error";
import { handleRzpWebhook } from "./services/webhook";
const app = express();
dotenv.config();
app.use(
  cors({
    origin: process.env.FRONTEND_HOST,
    credentials: true,
    methods: "POST",
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.post(
  "/webhook/razorpay",
  express.raw({ type: "application/json" }),
  handleRzpWebhook,
);
app.use(express.json());
app.use(cookieParser());
app.post("/api", async (req, res) => {
  const { namespace, apiName, data } = req.body;

  try {
    // 1. Find the module
    const path = `./api/${namespace}/${apiName}`;
    const { inputSchema, requiresAuth } = await import(`${path}/constants`);
    const { default: run } = await import(`${path}/run`);

    // 2. Validate data
    const validatedData = inputSchema.parse(data);
    let context = { user: null };

    if (requiresAuth) {
      context.user = await getAuthenticatedUser(req.cookies);
    }

    // 3. Run Logic
    const result = await run(validatedData, context);

    // 4. Set Cookie (Specific to Signup/Login)
    if (result.token) {
      res.cookie("token", result.token, {
        httpOnly: true,
        expires: new Date(Date.now() + 8 * 3600000),
      });
      delete result.token;
    }
    if (result.clearCookie) {
      res.cookie("token", null, {
        httpOnly: true,
        expires: new Date(0),
      });
    }
    // 5. Success Response
    return res.status(200).json({ status: "ok", data: result });
  } catch (error: any) {
    // Check if it's a Zod Validation Error
    if (error.name === "ZodError") {
      const validationError = fromZodError(error, {
        maxIssuesInMessage: 1,
        prefix: null,
        includePath: true,
      });
      return res.json({
        status: "error",
        data: {
          message: validationError.message,
        },
      });
    }

    return res.json({
      status: "error",
      data: {
        message: error.message || "An unexpected error occurred",
      },
    });
  }
});
app.get("/health", (req, res) => {
  res.send("Hello World, from express");
});
import("./services/cron");
connectDB()
  .then(() => {
    app.listen(8000, () => {
      console.log("Server started on 8000 and Database connected");
    });
  })
  .catch(() => {
    console.log("Database did not connected Successfully");
  });
