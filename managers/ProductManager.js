const fs = require("fs");
const path = require("path");

class ProductManager {
  constructor() {
    this.path = path.resolve(__dirname, "../data/products.json");
  }

  async getProducts() {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async getProductById(id) {
    const products = await this.getProducts();
    const product = products.find((p) => p.id === id);
    if (!product) throw new Error("Produto não encontrado.");
    return product;
  }

  async addProduct(product) {
    const products = await this.getProducts();
    product.id =
      products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
    products.push(product);
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
    return product;
  }

  async updateProduct(id, updates) {
    const products = await this.getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Produto não encontrado.");

    products[index] = { ...products[index], ...updates, id };
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const filteredProducts = products.filter((p) => p.id !== id);
    if (products.length === filteredProducts.length)
      throw new Error("Produto não encontrado.");

    await fs.promises.writeFile(
      this.path,
      JSON.stringify(filteredProducts, null, 2)
    );
    return true;
  }
}

module.exports = ProductManager;
