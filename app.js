const express = require("express");
const productsRouter = require("./routes/products.routes");
const cartsRouter = require("./routes/carts.routes");

const app = express();
const port = 8080;

app.use(express.json());

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
