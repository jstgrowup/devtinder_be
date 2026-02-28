import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./config/database";
import dotenv from "dotenv";
import { getAuthenticatedUser } from "./services/auth";
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

app.post("/api", async (req, res) => {
  const { namespace, apiName, data } = req.body;

  try {
    // 1. Find the module
    const path = `./api/${namespace}/${apiName}`;
    const { inputSchema, requiresAuth } = await import(`${path}/constants.ts`);
    const { default: run } = await import(`${path}/run.ts`);

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
    }

    // 5. Success Response
    return res.status(200).json({ status: "ok", data: result });
  } catch (error: any) {
    // Zod errors or Thrown errors land here
    return res.status(200).json({
      status: "error",
      message: error.message || "Something went wrong",
    });
  }
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
