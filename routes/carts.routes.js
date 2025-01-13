const express = require("express");
const CartManager = require("../managers/CartManager");

const router = express.Router();
const cartManager = new CartManager();

router.post("/", async (req, res) => {
  const newCart = await cartManager.createCart();
  res.json(newCart);
});

router.get("/:cid", async (req, res) => {
  try {
    const cart = await cartManager.getCartById(parseInt(req.params.cid));
    res.json(cart);
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { quantity } = req.body;
    const updatedCart = await cartManager.addProductToCart(
      parseInt(req.params.cid),
      parseInt(req.params.pid),
      quantity
    );
    res.json(updatedCart);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;
