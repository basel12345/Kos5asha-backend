const Joi = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConnectSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

function validateConnect(connect) {
  const schema = {
    name: Joi.string().min(0).required(),
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    mobile: Joi.string().required(),
    message: Joi.string().required(),
  };
  return Joi.validate(connect, schema);
}
const Connect = mongoose.model("Connect", ConnectSchema);
exports.Connect = Connect;
exports.validate = validateConnect;
