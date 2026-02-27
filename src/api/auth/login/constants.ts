import { zLogin } from "../../../zod/auth";

export const inputSchema = zLogin;

export const requiresAuth = false;
