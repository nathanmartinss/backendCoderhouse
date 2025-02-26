require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const path = require("path");
const { create } = require("express-handlebars");
const { Server } = require("socket.io");
const http = require("http");
const Product = require("./models/Product");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Configuração Handlebars
const hbs = create({ extname: ".handlebars" });
app.engine(".handlebars", hbs.engine);
app.set("view engine", ".handlebars");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Sessão
app.use(
  session({
    secret: "secreto123",
    resave: false,
    saveUninitialized: false,
  })
);

// Passport
require("./config/passport.config")(passport);
app.use(passport.initialize());
app.use(passport.session());

// Conexão MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("🔥 MongoDB conectado!"))
  .catch((err) => console.error(err));

// Rotas
app.use("/", require("./routes/auth.routes"));
app.use("/api/products", require("./routes/products.routes")(io));
app.use("/api/carts", require("./routes/carts.routes"));

// Middleware autenticação
const authMiddleware = (req, res, next) => {
  if (!req.isAuthenticated()) return res.redirect("/login");
  next();
};

// Rotas protegidas
app.get("/products", authMiddleware, async (req, res) => {
  const products = await Product.find().lean();
  res.render("products", { products, user: req.user });
});

app.get("/", (req, res) => {
  res.redirect("/login");
});

// Websocket
io.on("connection", async (socket) => {
  const products = await Product.find().lean();
  socket.emit("updateProducts", products);
});

// Servidor
const PORT = process.env.PORT || 8080;
server.listen(PORT, () =>
  console.log(`🚀 Rodando em http://localhost:${PORT}`)
);

module.exports = { app, io };
