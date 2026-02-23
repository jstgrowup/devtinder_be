import { Worker } from "bullmq";
import { sendEmail } from "./email";

const worker = new Worker(
  "emailQueue",
  async (job) => {
    sendEmail({
      fromAddress: "subham@byldd.com",
      toAddress: job.data.toAddress,
      subject: "Pending Connection Reminder",
      body: {},
    });
  },
  {
    connection: {
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: Number(process.env.REDIS_PORT) || 6379,
    },
    concurrency: 5,
  },
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});

console.log("📧 Email worker started...");
