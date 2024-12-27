const express = require("express");
const ProductManager = require("./ProductManager");

const app = express();
const port = 3001;

const manager = new ProductManager("./products.json");

(async () => {
  try {
    await manager.addProduct({
      title: "Playstation 5",
      description: "O console de nova geração da Sony",
      price: 4000,
      thumbnail:
        "https://gmedia.playstation.com/is/image/SIEPDC/ps5-product-thumbnail-01-en-14sep21?$facebook$",
      code: "1",
      stock: 10,
    });

    await manager.addProduct({
      title: "The Last Of Us",
      description: "Um dos maiores jogos da história",
      price: 200,
      thumbnail:
        "https://image.api.playstation.com/vulcan/ap/rnd/202206/0720/eEczyEMDd2BLa3dtkGJVE9Id.png",
      code: "2",
      stock: 5,
    });
  } catch (error) {
    console.error(error.message);
  }
})();

app.get("/products", async (req, res) => {
  try {
    const { limit } = req.query;
    const products = await manager.getProducts();

    if (limit) {
      const limitedProducts = products.slice(0, parseInt(limit));
      return res.json(limitedProducts);
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar produtos." });
  }
});

app.get("/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await manager.getProductById(parseInt(pid));

    res.json(product);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
