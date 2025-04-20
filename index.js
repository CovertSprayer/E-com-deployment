require("dotenv").config();
const express = require("express");
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const { User } = require("./models");
const DB_STRING = process.env.DB_STRING || "mongodb://127.0.0.1:27017/E_com_Dec";
const MongoStore = require("connect-mongo");

//  mongodb connection
mongoose.connect(DB_STRING)
  .then(() => console.log("DB connected: ", DB_STRING))
  .catch(err => console.log("Error in connecting to DB", err))

app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.use(methodOverride("_method"));

app.use(session({
  store: MongoStore.create({
    mongoUrl: DB_STRING,
    ttl: 7 * 24 * 60 * 60
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}))
app.use(flash());

//  ==================== passport setup ======================
// initializing passport
app.use(passport.initialize())
app.use(passport.session());

// LocalStrategy for username, email based authentication
passport.use(new LocalStrategy(User.authenticate()));

// to serialize user in session
passport.serializeUser(User.serializeUser());

// to deserialize user from session
passport.deserializeUser(User.deserializeUser());
//  ============================================================

app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.totalProductsInCart = req.user?.cart?.reduce((total, item)=>{
    return total += item.quantity
  }, 0);
  next();
})

app.get('/', (req, res) => {
  res.render("home.ejs");
})

// ------------ routes
const productRoutes = require('./routes/product.routes');
const reviewRoutes = require('./routes/review.routes');
const authRoutes = require('./routes/auth.routes');
const cartRoutes = require('./routes/cart.routes');
const wishListRoutes = require('./routes/api/wishlist.routes');
const paymentRoutes = require('./routes/api/payment.routes');

app.use(productRoutes);
app.use(reviewRoutes);
app.use(authRoutes);
app.use(cartRoutes);
app.use("/api", wishListRoutes);
app.use("/api", paymentRoutes);

app.get("*", (req, res) => {
  res.render("404.ejs");
})


// global catches
// app.use((error, req, res, next)=>{
//   console.log(error);
//   res.render("error.ejs", {err: "Something Went Wrong, Please try again later. hello from global catches" })
// })

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("Server is up at port", PORT);
})