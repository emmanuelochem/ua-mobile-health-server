const Joi = require("@hapi/joi");

const registerSchema = Joi.object({
    firstname: Joi.string().min(3).required(),
    lastname: Joi.string().min(3).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().min(11).max(15).required(),
  });

  const loginSchema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });

module.exports = {registerSchema, loginSchema};