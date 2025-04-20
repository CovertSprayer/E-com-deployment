const express = require("express");
const router = express.Router();
const validator = require("../middlewares/validator");
const { userRegisterationSchema } = require("../validators/user");
const { User } = require("../models");
const passport = require("passport");

router.get("/login", (req, res) => {
  res.render("auth/login.ejs");
});

router.get("/register", (req, res) => {
  res.render("auth/register.ejs");
});

router.post("/register", validator(userRegisterationSchema), async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const user = new User({ username, email, role });
    const registeredUser = await User.register(user, password);

    req.flash("success", "You are registerd successfully, Please Login!");
    res.redirect("/login");
  } catch (error) {
    console.log("Error in register route", error);
    res.render("error.ejs", {err: "Something went wrong, Please try again later"});
  }
});

router.post("/login", passport.authenticate('local', {
  failureRedirect: "/login",
  successRedirect: "/products",
  failureFlash: true
}))

router.post('/logout', function(req, res) {
  req.logout(function(err) {
    if (err) { 
      console.log("Error in logging out", err);
      res.render("error.ejs", {err: err.message})
    }

    req.flash("success", "Successfully logged out");
    res.redirect('/login');
  });
});

module.exports = router;
