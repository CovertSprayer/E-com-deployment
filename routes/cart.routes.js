const { isLoggedIn } = require('../middlewares/auth');
const { Product, User } = require('../models');

const router = require('express').Router();

router.post('/products/:productId/cart', isLoggedIn, async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;

  const product = await Product.findById(productId);
  if(!product){
    return res.render("error.ejs", {err: "Product not found!!"});
  }

  const user = await User.findById(userId);
  const cartItem = user.cart.find(cartItem => cartItem.productId == productId)

  // if(cartItem){
  //   cartItem.quantity++;
  // }else {
  //   user.cart.push({productId})
  // }

  cartItem ? cartItem.quantity++ : user.cart.push({productId});

  await user.save();
  res.redirect("back");
})

router.get('/cart', isLoggedIn, async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId).populate("cart.productId");

  const totalPrice = user.cart.reduce((total, cartItem) => {
    return total += cartItem.quantity * cartItem.productId.price;
  }, 0)

  res.render("cart/list.ejs", {cart: user.cart, totalPrice})
})

module.exports = router;