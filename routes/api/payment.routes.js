const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;
const { Product } = require("../../models");
const Order = require("../../models/Order");
const { isLoggedIn } = require("../../middlewares/auth");
const {
  validatePaymentVerification,
} = require("../../node_modules/razorpay/dist/utils/razorpay-utils");

router.post("/order", isLoggedIn, async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id;

  const product = await Product.findById(productId);

  if (!product) {
    return res.status(400).json({
      succes: false,
      message: `Product not found with id ${productId}`,
    });
  }

  const instance = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
  });

  var options = {
    amount: product.price * 100,
    currency: "INR",
  };

  const razorpay_order = await instance.orders.create(options);
  const order = await Order.create({
    _id: razorpay_order.id,
    userId: userId,
    amount: product.price,
    options: razorpay_order,
  });

  res.status(200).json({
    success: true,
    data: order,
    message: "Order created successfully",
  });
});

router.post("/confirm-payment", async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;

  const isValid = validatePaymentVerification(
    {
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
    },
    razorpay_signature,
    RAZORPAY_KEY_SECRET
  );

  if (isValid) {
    await Order.findByIdAndUpdate(razorpay_order_id, { payment: true });
    // res.status(200).json({
    //   success: true,
    //   message: "Payment updated successfully"
    // })
    res.redirect("/products");
  }
  else {
    res.status(400).json({
      success: false,
      message: "Not a valid payment"
    })
  }
});

module.exports = router;
