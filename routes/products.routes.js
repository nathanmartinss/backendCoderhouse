const express = require("express");
const ProductManager = require("../managers/ProductManager");

const router = express.Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
  try {
    const { limit } = req.query;
    const products = await productManager.getProducts();

    if (limit && !isNaN(limit) && parseInt(limit) > 0) {
      const limitedProducts = products.slice(0, parseInt(limit));
      return res.json(limitedProducts);
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar produtos." });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const product = await productManager.getProductById(
      parseInt(req.params.pid)
    );
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const newProduct = await productManager.addProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const updatedProduct = await productManager.updateProduct(
      parseInt(req.params.pid),
      req.body
    );
    res.json(updatedProduct);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    await productManager.deleteProduct(parseInt(req.params.pid));
    res.json({ message: "Produto deletado com sucesso." });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
