require("dotenv").config();
const express = require("express");
const { create } = require("express-handlebars");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const productsRouter = require("./routes/products.routes");
const cartsRouter = require("./routes/carts.routes");
const authRouter = require("./routes/auth.routes");
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

const session = require("express-session");

app.use(
  express.json(),
  express.urlencoded({ extended: true }),
  express.static(path.join(__dirname, "public"))
);

app.use(
  express.urlencoded({ extended: true }),
  express.json(),
  express.static("public")
);

app.use(
  require("express-session")({
    secret: "secreto123",
    resave: false,
    saveUninitialized: false,
  })
);

// MongoDB
const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("🔥 Conectado ao MongoDB"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB", err));

// Routers
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", authRouter);

// Middleware para verificar se usuário está logado
const authMiddleware = (req, res, next) => {
  if (!req.session.user) return res.redirect("/login");
  next();
};

// Rotas principais das views
app.get("/", authMiddleware, async (req, res) => {
  const products = await Product.find().lean();
  res.render("home", { products, user: req.session.user });
});

app.get("/products", authMiddleware, async (req, res) => {
  const products = await Product.find().lean();
  res.render("products", { products, user: req.session.user });
});

app.get("/realtimeproducts", authMiddleware, async (req, res) => {
  const products = await Product.find().lean();
  res.render("realTimeProducts", { products, user: req.session.user });
});

io.on("connection", async (socket) => {
  console.log("Cliente conectado");
  const products = await Product.find();
  socket.emit("updateProducts", products);
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
