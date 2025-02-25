const express = require("express");
const Product = require("../models/Product");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// Rota protegida
router.get("/", authMiddleware, async (req, res) => {
  const products = await Product.find();
  res.render("home", { user: req.session.user, products });
});

module.exports = router;
