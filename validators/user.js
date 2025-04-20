const Joi = require("joi");

const userRegisterationSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email(),
  role: Joi.string().required().valid('seller', 'buyer'),
  password: Joi.string().required()
})

module.exports = {
  userRegisterationSchema
}