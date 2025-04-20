const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String
  },
  role: {
    type: String,
    required: true,
    enum: ["seller", "buyer"]
  },
  cart: [
    {
      _id: false,
      productId: {
        type: mongoose.Types.ObjectId,
        ref: "Product"
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ],
  wishList: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Product"
    }
  ]
})

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);