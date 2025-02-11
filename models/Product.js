const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  stock: Number,
  category: String,
  thumbnails: [String],
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
