const Joi = require('joi');

const productSchema = Joi.object({
  title: Joi.string().required(),
  price: Joi.number().min(0),
  description: Joi.string(),
  image: Joi.string()
})

const reviewSchema = Joi.object({
  rating: Joi.number().min(1).max(5).required(),
  text: Joi.string()
})


module.exports = {
  productSchema,
  reviewSchema
};