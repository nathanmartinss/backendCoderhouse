const fs = require("fs");
const path = require("path");

class CartManager {
  constructor() {
    this.path = path.resolve(__dirname, "../data/carts.json");
  }

  async getCarts() {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async createCart() {
    const carts = await this.getCarts();
    const newCart = {
      id: carts.length > 0 ? Math.max(...carts.map((c) => c.id)) + 1 : 1,
      products: [],
    };
    carts.push(newCart);
    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
    return newCart;
  }

  async getCartById(id) {
    const carts = await this.getCarts();
    const cart = carts.find((c) => c.id === id);
    if (!cart) throw new Error("Carrinho não encontrado.");
    return cart;
  }

  async addProductToCart(cartId, productId, quantity) {
    const carts = await this.getCarts();
    const cartIndex = carts.findIndex((c) => c.id === cartId);
    if (cartIndex === -1) throw new Error("Carrinho não encontrado.");

    const existingProduct = carts[cartIndex].products.find(
      (p) => p.id === productId
    );
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      carts[cartIndex].products.push({ id: productId, quantity });
    }

    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
    return carts[cartIndex];
  }
}

module.exports = CartManager;
