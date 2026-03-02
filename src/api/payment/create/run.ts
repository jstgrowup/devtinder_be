import { Payment } from "../../../models/Payment";
import { razorpayInstance } from "../../../services/razorpay";
import { IMongoContext } from "../../../types";
import { ISubscriptionBody, PLAN_PRICE_MAP } from "./constants";

export default async function run(
  payload: ISubscriptionBody,
  context: IMongoContext,
) {
  const selectedPlan = PLAN_PRICE_MAP[payload?.plan.toUpperCase()];
  const order = await razorpayInstance.orders.create({
    amount: selectedPlan?.price ?? 0,
    currency: "INR",
    notes: {
      userId: context.user._id.toString(),
      plan: payload?.plan,
    },
  });

  const { _id, amount, orderId, plan } = await Payment.create({
    userId: context.user._id,
    orderId: order.id,
    amount: order.amount,
    plan: payload.plan,
  });
  return {
    data: {
      id: _id,
      amount,
      orderId,
      plan,
      name: context.user.firstName,
      email: context.user.emailId,
    },
  };
}
