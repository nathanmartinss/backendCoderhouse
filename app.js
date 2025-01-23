const express = require("express");
const { create } = require("express-handlebars");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const hbs = create({ extname: ".handlebars" });
app.engine(".handlebars", hbs.engine);
app.set("view engine", ".handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

let products = [
  {
    id: 1,
    name: "Produto 1",
    price: 100,
    description: "Descrição do Produto 1",
  },
  {
    id: 2,
    name: "Produto 2",
    price: 200,
    description: "Descrição do Produto 2",
  },
];

app.get("/", (req, res) => {
  res.render("home", { products });
});

app.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", { products });
});

app.post("/add", (req, res) => {
  const { name, price, description } = req.body;
  const newProduct = {
    id: products.length + 1,
    name,
    price: Number(price),
    description,
  };
  products.push(newProduct);
  io.emit("updateProducts", products);
  res.redirect("/realtimeproducts");
});

app.post("/delete", (req, res) => {
  const { id } = req.body;
  products = products.filter((product) => product.id !== Number(id));
  io.emit("updateProducts", products);
  res.redirect("/realtimeproducts");
});

io.on("connection", (socket) => {
  console.log("Novo cliente conectado");
  socket.emit("updateProducts", products);
  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
