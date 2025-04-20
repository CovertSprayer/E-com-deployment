const express = require("express");
const router = express.Router();
const { Product } = require("../models");
const validator = require("../middlewares/validator");
const { productSchema } = require("../validators/product");
const { isLoggedIn, isSeller } = require("../middlewares/auth");

router.get("/products", async (req, res) => {
  const products = await Product.find();
  res.render("products/list.ejs", { products });
})

router.get("/products/new", isLoggedIn, isSeller,  async (req, res) => {
  res.render("products/new.ejs");
})

router.get("/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId).populate("reviews");
    res.render("products/show.ejs", { product });
  } catch (error) {
    console.log(error);
    res.render("error.ejs", {err: "Something Went Wrong, Please try again later."});
  }
})

router.post("/products", validator(productSchema), isLoggedIn, isSeller, async (req, res, next) => {
 try {
   const value = req.body;
   const product = await Product.create({
     title: value.title,
     image: value.image,
     price: value.price,
     description: value.description
   });
   req.flash("success", "Product created successfully!")
   res.redirect("/products");
 } catch (error) {
  console.log(error);
  res.render("error.ejs", {err: "Something Went Wrong, Please try again later."});
 }
})

router.get("/products/:id/edit", isLoggedIn, isSeller, async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render('products/edit', { product });
})

router.put("/products/:id", validator(productSchema), isLoggedIn, isSeller, async (req, res) => {
  try {
    const { title, description, image, price } = req.body;
    const { id } = req.params;
    const existingProduct = await Product.findById(id);
  
    existingProduct.title = title;
    existingProduct.description = description;
    existingProduct.image = image;
    existingProduct.price = price;
  
    await existingProduct.save();

    req.flash("success", "Product updated successfully!")
    res.redirect('/products');
  } catch (error) {
    console.log(error);
    res.render("error.ejs", {err: "Something Went Wrong, Please try again later."});
  }
})

router.delete("/products/:id", isLoggedIn, isSeller, async (req, res) => {
  const { id } = req.params;
  await Product.findByIdAndDelete(id);

  req.flash("success", "Product deleted successfully!")
  res.redirect('/products');
})

module.exports = router;