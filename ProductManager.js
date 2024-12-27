const fs = require("fs");
const path = require("path");

class ProductManager {
  constructor(pathFile) {
    this.path = path.resolve(__dirname, pathFile);
  }

  async addProduct(product) {
    const products = await this.getProducts();
    const { title, description, price, thumbnail, code, stock } = product;

    if (!title || !description || !price || !thumbnail || !code || !stock) {
      throw new Error("Todos os campos são obrigatórios.");
    }

    if (products.some((p) => p.code === code)) {
      throw new Error(`O código ${code} já existe.`);
    }

    const newProduct = {
      id: products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1,
      ...product,
    };

    products.push(newProduct);
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
    return newProduct;
  }

  async getProducts() {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Arquivo não encontrado ou vazio. Criando novo.");
      return [];
    }
  }

  async getProductById(id) {
    if (!id || typeof id !== "number") {
      throw new Error("ID inválido.");
    }
    const products = await this.getProducts();
    const product = products.find((p) => p.id === id);
    if (!product) throw new Error("Produto não encontrado.");
    return product;
  }

  async updateProduct(id, updates) {
    const products = await this.getProducts();
    const productIndex = products.findIndex((p) => p.id === id);

    if (productIndex === -1) throw new Error("Produto não encontrado.");

    products[productIndex] = { ...products[productIndex], ...updates, id };
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
    return products[productIndex];
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const filteredProducts = products.filter((p) => p.id !== id);

    if (products.length === filteredProducts.length) {
      throw new Error("Produto não encontrado.");
    }

    await fs.promises.writeFile(
      this.path,
      JSON.stringify(filteredProducts, null, 2)
    );
    return true;
  }
}

module.exports = ProductManager;
