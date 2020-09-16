const express = require("express");
const error = require("../middleware/error");
const cors = require("cors");
const path = require("path");
const employment = require("../routes/employment");
const connect = require("../routes/connect-us");
const register = require("../routes/register-data");
const user = require("../routes/user");
const auth = require("../routes/auth");

module.exports = function (app) {
  app.use(cors());
  app.use(express.json());
  app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
  app.use("/employment", employment);
  app.use("/connect", connect);
  app.use("/register", register);
  app.use("/user", user);
  app.use("/auth", auth);
  app.use(error);
};
