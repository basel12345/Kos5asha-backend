const express = require("express");
const router = express.Router();
const Register = require("../model/register-data");
const auth = require("../middleware/auth");
const nurserySchool = require("../middleware/nurserySchool");
const superAdmin = require("../middleware/superAdmin");

router.get("/getRegisters", auth, async (req, res) => {
  const register = await Register.find();
  res.send(register);
});

router.get(
  "/getSpecificRegisters/:id",
  [auth, superAdmin],
  async (req, res) => {
    const register = await Register.findById(req.params.id);
    if (!register) return res.status(404).send("this register not found");
    res.send(register);
  }
);

/* ------------the route for adding-------------- */

router.post("/addRegister", [auth, nurserySchool], async (req, res) => {
  const newRegister = new Register({
    name: req.body.name,
    email: req.body.email,
    mobile: req.body.mobile,
    telephone: req.body.telephone,
    License: req.body.License,
    coords: req.body.coords,
    address: req.body.address,
    Capacity: req.body.Capacity,
    numberOfNurseries: req.body.numberOfNurseries,
    watchPrice: req.body.watchPrice,
    durationContract: req.body.durationContract,
    caseOfNurseries: req.body.caseOfNurseries,
  });
  await newRegister.save((err, register) => {
    if (err) {
      return res.send({
        status: false,
        message: err.message,
      });
    }
    res.send({
      status: true,
      message: "Register saved",
      register,
    });
  });
});

/* ------------the route for edit user-------------- */

router.put("/editRegister/:id", [auth, nurserySchool], async (req, res) => {
  const register = await Register.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      telephone: req.body.telephone,
      License: req.body.License,
      coords: req.body.coords,
      Capacity: req.body.Capacity,
      address: req.body.address,
      numberOfNurseries: req.body.numberOfNurseries,
      watchPrice: req.body.watchPrice,
      durationContract: req.body.durationContract,
      caseOfNurseries: req.body.caseOfNurseries,
    },
    { new: true }
  );

  if (!register) return res.status(404).send("this register not found");
  await register.save((err, register) => {
    if (err) {
      return res.send({
        status: false,
        message: err.message,
      });
    }
    return res.send({
      status: true,
      message: "Register Edited",
      register,
    });
  });
});

/* ------------the route for deleting-------------- */

router.delete("/deleteRegister/:id", [auth, superAdmin], async (req, res) => {
  const soecificRegister = await Register.findByIdAndRemove(req.params.id);
  if (!soecificRegister) return res.status(404).send("Not find this id");
  return res.send({
    suceess: true,
    message: " this is removed ",
  });
});

module.exports = router;
