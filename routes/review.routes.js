const express = require('express');
const { Review, Product } = require('../models');
const validator = require('../middlewares/validator');
const { reviewSchema } = require('../validators/product');
const router = express.Router();

router.post("/products/:productId/reviews", validator(reviewSchema), async (req, res) => {
  const productId = req.params.productId;
  const { rating, text } = req.body;

  // create review
  const review = await Review.create({ rating, text });

  // find product
  // const product = await Product.findById(productId);
  // product.reviews.push(review._id);
  // await product.save();

  await Product.findByIdAndUpdate(productId, {
    $addToSet: { reviews: review._id }
  })

  // res.redirect(`/products/${productId}`);
  res.redirect("back");
})


module.exports = router;