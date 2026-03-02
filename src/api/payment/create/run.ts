import { razorpayInstance } from "../../../services/razorpay";
import { IMongoContext } from "../../../types";
import { ISubscriptionBody } from "./constants";

export default async function run(
  data: ISubscriptionBody,
  context: IMongoContext,
) {
  const order = await razorpayInstance.orders.create({
    amount: data?.amount ?? 0,
    currency: "INR",
    notes: {
      userId: context.user._id.toString(),
      plan: data?.plan,
    },
  });

  return {
    data: order,
  };
}
