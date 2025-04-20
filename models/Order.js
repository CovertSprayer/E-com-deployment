const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  _id: String,
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User"
  },
  productIds: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Product"
    }
  ],
  amount: String,
  payment: {
    type: Boolean,
    default: false
  },
  options: {
    type: Object
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Order", orderSchema);