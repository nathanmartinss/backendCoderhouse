const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Ticket = require("../models/Ticket");
const cartDAO = require("../dao/CartDAO");
const productDAO = require("../dao/ProductDAO");
const { isUser } = require("../middlewares/auth.middleware");
const UserDTO = require("../dto/UserDTO");

router.post("/", async (req, res) => {
  try {
    const newCart = new Cart({ products: [] });
    await newCart.save();
    res.status(201).json({ message: "Carrinho criado!", cart: newCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid);
    if (!cart)
      return res.status(404).json({ message: "Carrinho não encontrado" });

    const existingProduct = cart.products.find(
      (p) => p.product.toString() === pid
    );

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid);
    if (!cart)
      return res.status(404).json({ message: "Carrinho não encontrado" });

    cart.products = cart.products.filter((p) => p.product.toString() !== pid);
    await cart.save();

    res.json({ message: "Produto removido do carrinho." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate(
      "products.product"
    );
    if (!cart)
      return res.status(404).json({ message: "Carrinho não encontrado" });

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/:cid/purchase", isUser, async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartDAO.getCartById(cid);
    if (!cart)
      return res.status(404).json({ message: "Carrinho não encontrado" });

    const available = [];
    const unavailable = [];

    for (const item of cart.products) {
      const productId = item.product._id || item.product;
      const product = await productDAO.getById(productId);

      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await product.save();
        available.push(item);
      } else {
        unavailable.push(item);
      }
    }

    const total = available.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    const userDTO = new UserDTO(req.user);

    const ticket = await Ticket.create({
      code: "TICKET-" + Date.now(),
      amount: total,
      purchaser: userDTO.email,
    });

    cart.products = unavailable;
    await cart.save();

    res.status(201).json({ ticket, notProcessed: unavailable });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
