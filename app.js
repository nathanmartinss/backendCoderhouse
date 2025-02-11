require("dotenv").config();
const express = require("express");
const { create } = require("express-handlebars");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const Product = require("./models/Product");

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

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("🔥 Conectado ao MongoDB"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB", err));

app.get("/", async (req, res) => {
  const products = await Product.find();
  res.render("home", { products });
});

app.get("/realtimeproducts", async (req, res) => {
  const products = await Product.find();
  res.render("realTimeProducts", { products });
});

app.post("/add", async (req, res) => {
  const { name, price, description } = req.body;
  const newProduct = new Product({
    name,
    price: Number(price),
    description,
  });
  await newProduct.save();
  const products = await Product.find();
  io.emit("updateProducts", products);
  res.redirect("/realtimeproducts");
});

app.post("/delete", async (req, res) => {
  const { id } = req.body;
  await Product.findByIdAndDelete(id);
  const products = await Product.find();
  io.emit("updateProducts", products);
  res.redirect("/realtimeproducts");
});

io.on("connection", async (socket) => {
  console.log("Novo cliente conectado");
  const products = await Product.find();
  socket.emit("updateProducts", products);
  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
