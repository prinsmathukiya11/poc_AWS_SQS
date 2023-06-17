const express = require("express");
const addController = require("./../controller/addcontroller");

const routes = express.Router();
routes.get("/addsqs", addController.add);
module.exports = routes;
