const express = require("express");
const router = express.Router();
const { Connect, validate } = require("../model/connect-us");
const auth = require("../middleware/auth");
const superAdmin = require("../middleware/superAdmin");

router.get("/getConnect", auth, async (req, res) => {
  const contact = await Connect.find();
  res.send(contact);
});

router.get("/getSpecificConnect/:id", [auth, superAdmin], async (req, res) => {
  const contact = await Connect.findById(req.params.id);
  if (!contact) return res.status(404).send("this contact not found");
  res.send(contact);
});

/* ------------the route for adding-------------- */

router.post("/addConnect", async (req, res) => {
  /* start validation by joi library */
  const { error } = validate(req.body);
  if (error) {
    return res.send({
      status: false,
      message: error.details[0].message,
    });
  }
  /* end validation by joi library */

  const newConnect = new Connect({
    name: req.body.name,
    email: req.body.email,
    mobile: req.body.mobile,
    message: req.body.message,
  });
  await newConnect.save((err, connect) => {
    if (err) {
      return res.send({
        status: false,
        message: err.message,
      });
    }
    res.send({
      status: true,
      message: "Connect saved",
      connect,
    });
  });
});

router.put("/editConnect/:id", async (req, res) => {
  /* start validation by joi library */
  const { error } = validate(req.body);
  if (error) {
    return res.send({
      status: false,
      message: error.details[0].message,
    });
  }
  /* end validation by joi library */
  const connect = await Connect.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      message: req.body.message,
    },
    { new: true }
  );

  if (!connect) return res.status(404).send("this connect not found");
  await connect.save((err, connect) => {
    if (err) {
      return res.send({
        status: false,
        message: err.message,
      });
    }
    return res.send({
      status: true,
      message: "Connect Edited",
      connect,
    });
  });
});

/* ------------the route for deleting-------------- */

router.delete("/deleteConnect/:id", [auth, superAdmin], async (req, res) => {
  const soecificConnect = await Connect.findByIdAndRemove(req.params.id);
  if (!soecificConnect) return res.status(404).send("Not find this id");
  return res.send({
    suceess: true,
    message: " this is removed ",
  });
});

module.exports = router;
