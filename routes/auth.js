const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = express.Router();
const { User, validateLogin } = require("../model/user");

/* ------------the route for register user-------------- */
router.post("/authUser", async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  /* end validation by joi library */

  /* Make sure it is correct email and passsword*/
  let user = await User.findOne({ email: req.body.email }); //email
  if (!user) return res.status(400).send("Invalid Email");

  const validPassword = await bcrypt.compare(
    req.body.password,
    user["password"]
  ); //password
  if (!validPassword) return res.status(400).send("Invalid Password");

  //token
  const token = jwt.sign(
    { _id: user._id, isRole: user["isRole"] },
    "jwtPrivateKey"
  );
  res.send({ user, token });
});

module.exports = router;
