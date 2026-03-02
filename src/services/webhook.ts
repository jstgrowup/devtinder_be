import { Request, Response } from "express";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils";
import { RAZORPAY_WEBHOOK_EVENT } from "../utils/enums";
import { Payment } from "../models/Payment";

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const webhookSignature = req.headers["x-Razorpay-Signature"] as string;
  const isWebhookValid = validateWebhookSignature(
    JSON.stringify(req.body),
    webhookSignature,
    process.env.RAZORPAY_WEBHOOK_SECRET,
  );
  if (!isWebhookValid) {
    res.status(400).json({ data: { message: "Webhook signature is invalid" } });
  }
  const metadata = req.body.payload.payment.entity;
  const payment = await Payment.findOne({ orderId: metadata.orderId });

  if (req.body.event === RAZORPAY_WEBHOOK_EVENT.PAYMENT_CAPTURED) {
  }
  if (req.body.event === RAZORPAY_WEBHOOK_EVENT.PAYMENT_FAILED) {
  }
};
