console.log("starting a new project");
const express = require("express");
const app = express();
app.use("/test", (req, res) => {
  res.send("Hello from server");
});
app.listen(8000, () => {
  console.log("Server started on 3000");
});
