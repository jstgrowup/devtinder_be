import { Request, Response } from "express";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils";
import {
  RAZORPAY_PAYMENT_STATUS,
  RAZORPAY_WEBHOOK_EVENT,
  SUBSCRIPTION_STATUS,
} from "../utils/enums";
import { Payment } from "../models/Payment";
import { User } from "../models/User";
import { Subscription } from "../models/Subscription";
import { addMonths } from "date-fns";

export const handleRzpWebhook = async (req: Request, res: Response) => {
  try {
    const webhookSignature = req.headers["x-razorpay-signature"] as string;
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "";
    const rawBody = req.body.toString("utf-8");
    const reqbody = JSON.parse(rawBody);
    const isWebhookValid = validateWebhookSignature(
      rawBody,
      webhookSignature,
      webhookSecret,
    );
    if (!isWebhookValid) {
      res
        .status(400)
        .json({ data: { message: "Webhook signature is invalid" } });
    }
    // Stops Razorpay retries
    res.status(200).send("ok");
    const metadata = reqbody.payload.payment.entity;

    const payment = await Payment.findOne({ orderId: metadata.order_id });
    if (!payment) {
      res.status(401).send("No payment found with this order");
    }
    if (reqbody.event === RAZORPAY_WEBHOOK_EVENT.PAYMENT_CAPTURED) {
      if (payment.status === RAZORPAY_PAYMENT_STATUS.CAPTURED) {
        console.log("⚠️ Payment already processed. Skipping...");
        return res.status(200).send("ok");
      }
      payment.status = metadata.status;
      await payment.save();

      await User.findByIdAndUpdate(payment.userId, {
        isPremiumUser: true,
      });
      const currentDate = new Date();

      const dateAfterOneMonth = addMonths(currentDate, 1);
      await Subscription.create({
        amount: payment.amount,
        currentPeriodEnds: dateAfterOneMonth,
        currentPeriodStarts: currentDate,
        plan: payment.plan,
        status: SUBSCRIPTION_STATUS.ACTIVE,
        userId: payment.userId,
      });

      // Email trigger here TBD
    }
    if (reqbody.event === RAZORPAY_WEBHOOK_EVENT.PAYMENT_FAILED) {
      payment.status = metadata.status;
      await payment.save();
    }
  } catch (error) {
    console.error("Webhook Processing Error:", error);
  }
};
