const Joi = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EmploymentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  qualification: {
    type: String,
    required: true,
  },
  yearsOfExperience: {
    type: String,
    required: true,
  },
  courses: {
    type: Array,
    required: true,
  },
  qualificationStatus: {
    type: String,
    required: true,
    default: "غير مؤهل",
  },
  cv: {
    type: String,
    required: true,
  },
  certificate: {
    type: String,
    required: true,
  },
});

function validateEmpolyment(employment) {
  const schema = {
    name: Joi.string().min(0).required(),
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    dateOfBirth: Joi.date().required(),
    qualification: Joi.string().min(0).required(),
    yearsOfExperience: Joi.string().min(0).required(),
    courses: Joi.array().min(0).required(),
  };
  return Joi.validate(employment, schema);
}
const Employment = mongoose.model("Employment", EmploymentSchema);
exports.Employement = Employment;
exports.validate = validateEmpolyment;
