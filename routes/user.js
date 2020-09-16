const express = require("express");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = express.Router();
const { User, validateRegister } = require("../model/user");
const auth = require("../middleware/auth");

/* ------------the route for get all users-------------- */
router.get("/getAllUsers", async (req, res) => {
  const Users = await User.find();
  res.send(Users);
});

/* ------------the route for register user-------------- */

router.post("/registerUser", async (req, res) => {
  /* start validation by joi library */
  const { error } = validateRegister(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  /* end validation by joi library */

  /* Make sure it is correct email*/
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered");

  user = await new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    isRole: req.body.isRole,
  });

  /*----------Encrypt------------*/
  const salt = await bcrypt.genSalt(10);
  user["password"] = await bcrypt.hash(user["password"], salt);
  user["confirmPassword"] = await bcrypt.hash(user["confirmPassword"], salt);

  /*-----------token----------*/
  const token = jwt.sign(
    { _id: user._id, isRole: user["isRole"] },
    "jwtPrivateKey"
  );
  await user.save((err, user) => {
    if (err) {
      return res.send({
        status: false,
        message: err.message,
      });
    }
    return res.header("x-auth-token", token).send({
      status: true,
      message: "user register",
      user,
      token,
    });
  });
});

/* ------------the route for edit user-------------- */

router.put("/editUser/:id", auth, async (req, res) => {
  /* start validation by joi library */
  const { error } = validateRegister(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  /* end validation by joi library */

  /* Make sure it is correct id*/
  let user = await User.findOne({ email: req.body.email });

  user = await User.findByIdAndUpdate(
    req.params.id,
    {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      isRole: req.body.isRole,
    },
    { new: true }
  );

  if (!user) return res.status(404).send("this user not found");
  /*----------Encrypt------------*/
  const salt = await bcrypt.genSalt(10);
  user["password"] = await bcrypt.hash(user["password"], salt);
  user["confirmPassword"] = await bcrypt.hash(user["confirmPassword"], salt);

  /*-----------token----------*/
  const token = jwt.sign(
    { _id: user._id, isRole: user["isRole"] },
    "jwtPrivateKey"
  );
  await user.save((err, user) => {
    if (err) {
      return res.send({
        status: false,
        message: err.message,
      });
    }
    return res.header("x-auth-token", token).send({
      status: true,
      message: "user Edited",
      user,
      token,
    });
  });
});

module.exports = router;
