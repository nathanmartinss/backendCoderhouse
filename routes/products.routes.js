const express = require("express");
const ProductDAO = require("../dao/ProductDAO");

const router = express.Router();

router.get("/", async (req, res) => {
  const products = await ProductDAO.getAllProducts();
  res.json(products);
});

router.post("/", async (req, res) => {
  const newProduct = await ProductDAO.addProduct(req.body);
  res.json(newProduct);
});

router.delete("/:id", async (req, res) => {
  await ProductDAO.deleteProduct(req.params.id);
  res.json({ message: "Produto excluído" });
});

module.exports = router;
