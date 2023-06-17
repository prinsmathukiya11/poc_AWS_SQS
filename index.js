const express = require("express");
const bodyParser = require("body-parser");
const app = express();
require("dotenv").config();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//routes
const addRoutes = require("./router/addroutes");
app.use("/user", addRoutes);

const anyRoutes = require("./router/anyroutes");
app.use("*", anyRoutes);

//server
var port = process.env.port;
app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
