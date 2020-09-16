const express = require("express");
const router = express.Router();
const Joi = require("joi");
const multer = require("multer");
const { Employement, validate } = require("../model/employment");
const auth = require("../middleware/auth");
const sitter = require("../middleware/sitter");
const superAdmin = require("../middleware/superAdmin");

/* ------------start Multer-------------- */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});

/* start filter type file */
const fileFilter = (req, file, cb) => {
  console.log(file.mimetype);
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
/* end filter type file */

/* start upload file */
const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});
/* end upload file */
/* ------------end Multer-------------- */

router.get("/getEmployement", auth, async (req, res) => {
  const employement = await Employement.find();
  res.send(employement);
});

router.get(
  "/getSpecificEmployement/:id",
  [auth, superAdmin],
  async (req, res) => {
    const employement = await Employement.findById(req.params.id);
    if (!employement) res.status(404).send("this employement not found");
    res.send(employement);
  }
);

/* ------------the route for adding-------------- */
var cpUpload = upload.fields([
  { name: "cv", maxCount: 1 },
  { name: "certificate", maxCount: 1 },
]);

router.post("/addEmployement", [auth, sitter], cpUpload, async (req, res) => {
  /* start validation by joi library */
  const { error } = validate(req.body);
  if (error) {
    return res.send({
      status: false,
      message: error.details[0].message,
    });
  }
  /* end validation by joi library */
  console.log(req.files);
  const newEmployment = new Employement({
    name: req.body.name,
    email: req.body.email,
    dateOfBirth: req.body.dateOfBirth,
    qualification: req.body.qualification,
    yearsOfExperience: req.body.yearsOfExperience,
    courses: req.body.courses,
    cv: req.files["cv"][0].path,
    certificate: req.files["certificate"][0].path,
  });
  await newEmployment.save((err, employment) => {
    if (err) {
      return res.send({
        status: false,
        message: err.message,
      });
    }
    res.send({
      status: true,
      message: "Employment saved",
      employment,
    });
  });
});

router.put("/editEmployement/:id", [auth, sitter], async (req, res) => {
  /* start validation by joi library */
  const { error } = validate(req.body);
  if (error) {
    return res.send({
      status: false,
      message: error.details[0].message,
    });
  }
  /* end validation by joi library */
  const employement = await Employement.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      dateOfBirth: req.body.dateOfBirth,
      qualification: req.body.qualification,
      yearsOfExperience: req.body.yearsOfExperience,
      courses: req.body.courses,
      cv: req.files["cv"][0].path,
      certificate: req.files["certificate"][0].path,
    },
    { new: true }
  );

  if (!employement) res.status(404).send("this employement not found");
  await employement.save((err, employement) => {
    if (err) {
      return res.send({
        status: false,
        message: err.message,
      });
    }
    res.send({
      status: true,
      message: "Employement Edited",
      employement,
    });
  });
});

router.put("/addRegistration/:id", [auth, superAdmin], async (req, res) => {
  /* start validation by joi library */
  const schema = {
    qualificationStatus: Joi.string().min(0).required(),
  };
  const result = Joi.validate(req.body, schema);
  if (result.error) {
    return res.send({
      status: false,
      message: result.error.details[0].message,
    });
  }
  /* end validation by joi library */
  const employement = await Employement.findByIdAndUpdate(
    req.params.id,
    {
      qualificationStatus: req.body.qualificationStatus,
    },
    { new: true }
  );

  if (!employement) return res.status(404).send("this registration not found");
  await employement.save((err, employement) => {
    if (err) {
      return res.send({
        status: false,
        message: err.message,
      });
    }
    return res.send({
      status: true,
      message: "Registration Edited",
      employement,
    });
  });
});

/* ------------the route for deleting-------------- */

router.delete("/deleteEmployment/:id", [auth, superAdmin], async (req, res) => {
  const soecificEmployment = await Employement.findByIdAndRemove(req.params.id);
  if (!soecificEmployment) return res.status(404).send("Not find this id");
  return res.send({
    suceess: true,
    message: " this is removed ",
  });
});

module.exports = router;
