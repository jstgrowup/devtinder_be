import { z } from "zod";
import { SUBSCRIPTION_PLANS } from "../../../utils/enums";

export const inputSchema = z.object({
  plan: z.enum(SUBSCRIPTION_PLANS),
});
export type ISubscriptionBody = z.infer<typeof inputSchema>;
export const requiresAuth = true;
export const PLAN_PRICE_MAP = {
  BASE: {
    id: SUBSCRIPTION_PLANS.BASE,
    price: process.env.BASE_PLAN_PRICE,
  },
  SUPER_BOOST: {
    id: SUBSCRIPTION_PLANS.SUPER_BOOST,
    price: process.env.SUPER_BOOST_PLAN_PRICE,
  },
};
