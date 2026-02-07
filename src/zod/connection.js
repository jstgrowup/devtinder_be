const { z } = require("zod");
const zConnectionRequest = z.object({
  status: z.enum(["ignore", "interested", "accepted", "rejected"]),
});
module.exports = { zConnectionRequest };
