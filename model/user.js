const Joi = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    unique: true,
    required: true,
  },
  confirmPassword: {
    type: String,
    required: true,
  },
  isRole: {
    type: Number,
    required: true, // super admin = 1 // user = 2
  },
});

// validation for login
function validateLogin(login) {
  const schema = {
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string()
      .regex(/^[a-zA-Z0-9]{3,30}$/)
      .required(),
  };
  return Joi.validate(login, schema);
}

// validation for register
function validateRegister(register) {
  const schema = {
    username: Joi.string().min(3).required(),
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string()
      .regex(/^[a-zA-Z0-9]{3,30}$/)
      .required(),
    confirmPassword: Joi.any()
      .valid(Joi.ref("password"))
      .required()
      .options({ language: { any: { allowOnly: "must match password" } } }),
    isRole: Joi.number().required(),
  };
  return Joi.validate(register, schema);
}

const User = mongoose.model("User", UserSchema);
exports.User = User;
exports.validateLogin = validateLogin;
exports.validateRegister = validateRegister;
