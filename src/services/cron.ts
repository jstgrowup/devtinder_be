import cron from "node-cron";
import { endOfDay, startOfDay, subDays } from "date-fns";
import { ConnectionRequest } from "../models/ConnectionRequest";
import { REQUEST_STATUS } from "../utils/enums";
import { IConnectionRequest, IUser } from "../types";
import { sendEmail } from "./email";
import { emailQueue } from "./bull";
export type IConnectionRequestPopulated = Omit<
  IConnectionRequest,
  "fromUserId" | "toUserId"
> & {
  fromUserId: IUser;
  toUserId: IUser;
};
cron.schedule("* * * * * ", async () => {
  try {
    const yesterday = subDays(new Date(), 1);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);
    const pendingRequestsOfYesterday = await ConnectionRequest.find({
      status: REQUEST_STATUS.INTERESTED,
      createdAt: {
        $gte: yesterdayStart,
        $lte: yesterdayEnd,
      },
    })
      .populate<{ fromUserId: IUser; toUserId: IUser }>("fromUserId toUserId")
      .lean<IConnectionRequestPopulated[]>();
    // const emails = Array.from(
    //   new Set(pendingRequestsOfYesterday.map((req) => req.toUserId.emailId)),
    // );
    const emails = [
      "deysubham999@gmail.com",
      "deysubham999@gmail.com",
      "deysubham999@gmail.com",
      "deysubham999@gmail.com",
      "deysubham999@gmail.com",
      "deysubham999@gmail.com",
    ];
    await emailQueue.addBulk(
      emails.map((email) => ({
        name: "sendEmailReminder",
        data: { toAddress: email },
        opts: {
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 5000,
          },
          removeOnComplete: true,
          removeOnFail: false,
        },
      })),
    );
  } catch (error) {}
  console.log("runing the cron");
});
