const express = require("express");
const Product = require("../models/Product");
const authMiddleware = require("../middlewares/auth.middleware");

module.exports = (io) => {
  const router = express.Router();

  router.get("/", authMiddleware, async (req, res) => {
    const products = await Product.find().lean();
    res.render("products", { user: req.session.user, products });
  });

  router.post("/", authMiddleware, async (req, res) => {
    try {
      const { name, price, description, category, thumbnails } = req.body;

      if (!name || !price || !description) {
        return res
          .status(400)
          .json({ message: "Campos obrigatórios faltando." });
      }

      const newProduct = new Product({
        name,
        price,
        description,
        category: category || "Geral",
        thumbnails: thumbnails || [],
      });

      await newProduct.save();

      const products = await Product.find().lean();
      io.emit("updateProducts", products);

      res.status(201).json({ message: "Produto criado!", product: newProduct });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.put("/:id", authMiddleware, async (req, res) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      if (!updatedProduct) {
        return res.status(404).json({ message: "Produto não encontrado." });
      }

      const products = await Product.find().lean();
      io.emit("updateProducts", products);

      res.json({ message: "Produto atualizado!", product: updatedProduct });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.delete("/:id", authMiddleware, async (req, res) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);

      if (!deletedProduct) {
        return res.status(404).json({ message: "Produto não encontrado." });
      }

      const products = await Product.find().lean();
      io.emit("updateProducts", products);

      res.json({ message: "Produto removido com sucesso!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
