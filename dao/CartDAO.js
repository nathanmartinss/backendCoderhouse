const Cart = require("../models/Cart");

class CartDAO {
  async getAllCarts() {
    return await Cart.find().populate("products.product");
  }

  async getCartById(id) {
    return await Cart.findById(id).populate("products.product");
  }

  async createCart() {
    const newCart = new Cart({ products: [] });
    return await newCart.save();
  }

  async addProductToCart(cartId, productId, quantity) {
    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error("Carrinho não encontrado");

    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId
    );

    if (productIndex !== -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    return await cart.save();
  }

  async removeProductFromCart(cartId, productId) {
    const cart = await Cart.findById(cartId);
    if (!cart) throw new Error("Carrinho não encontrado");

    cart.products = cart.products.filter(
      (p) => p.product.toString() !== productId
    );
    return await cart.save();
  }

  async deleteCart(id) {
    return await Cart.findByIdAndDelete(id);
  }
}

module.exports = new CartDAO();
