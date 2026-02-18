import { zSignUp } from "./auth";
export const zEditProfile = zSignUp
  .omit({
    emailId: true,
    password: true,
  })
  .partial();
