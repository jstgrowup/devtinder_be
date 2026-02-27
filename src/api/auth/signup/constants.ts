import { zSignUp } from "../../../zod/auth";

export const inputSchema = zSignUp;

export const requiresAuth = false;
