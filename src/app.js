console.log("starting a new project");
const express = require("express");
const app = express();
app.use("/test", (req, res) => {
  res.send("Hello from server");
});
app.use(
  "/user",
  (req, res, next) => {
    console.log("first");
    // res.send("Sent 1");
    next();
  },
  (req, res) => {
    console.log("second");
    res.send("Sent 2");
  },
);
app.listen(8000, () => {
  console.log("Server started on 8000");
});
