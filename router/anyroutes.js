const express = require("express");
const router = express.Router({ mergeParams: true });

router.all("*", (req, res) => {
  console.log("In any routes");
  res.send(400).json({
    status: "fail",
    message: `Can't find ${req.originalUrl}`,
  });
});
module.exports= router;
