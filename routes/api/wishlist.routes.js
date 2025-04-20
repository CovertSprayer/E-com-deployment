const router = require('express').Router();
const { isLoggedIn } = require('../../middlewares/auth');
const { Product, User } = require('../../models');

router.post('/products/:productId/wishlist', isLoggedIn, async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.productId;

    const product = await Product.findById(productId);
    if(!product) {
      return res.render("error.ejs", {err: "Product not found!"});
    }
    const user = await User.findById(userId);
    const index = user.wishList.findIndex(id => id == productId);

    if(index === -1){
      user.wishList.push(productId);
    }else {
      user.wishList.splice(index, 1);
    }

    await user.save();
    res.status(200).json({
      success: true,
      message: index === -1 ? "Product added to wishlist successfully" : "Product removed from wishlist successfully"
    })
  } catch (error) {
    console.log("Internal error in wishlist route", error);
    res.status(500).json({
      success: false,
      message: `Internal Error: ${error.message}`
    })
  }
})


module.exports = router;