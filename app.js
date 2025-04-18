const express = require("express");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const path = require("path");
const { create } = require("express-handlebars");
const { Server } = require("socket.io");
const http = require("http");

const Product = require("./models/Product");
const config = require("./config/config");
const errorHandler = require("./middlewares/errorHandler");
const { addLogger } = require("./middlewares/logger.middleware");
const loggerRoutes = require("./routes/logger.routes");
const { logger } = require("./config/logger");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Configuração do Handlebars
const hbs = create({ extname: ".handlebars" });
app.engine(".handlebars", hbs.engine);
app.set("view engine", ".handlebars");
app.set("views", path.join(__dirname, "views"));

// Middlewares padrão
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Sessões
app.use(
  session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Logger personalizado
app.use(addLogger);
app.use("/", loggerRoutes);

// Passport
require("./config/passport.config")(passport);
app.use(passport.initialize());
app.use(passport.session());

// Conexão com MongoDB
mongoose
  .connect(config.MONGO_URI)
  .then(() => logger.info("🔥 MongoDB conectado!"))
  .catch((err) => logger.error("❌ Erro ao conectar no MongoDB:", err));

// Rotas
app.use("/api/sessions", require("./routes/sessions.routes"));
app.use("/", require("./routes/auth.routes"));
app.use("/api/products", require("./routes/products.routes")(io));
app.use("/api/carts", require("./routes/carts.routes"));
app.use("/api", require("./routes/mocking.routes"));

// Middleware de autenticação
const authMiddleware = (req, res, next) => {
  if (!req.isAuthenticated()) return res.redirect("/login");
  next();
};

// Página de produtos (protegida)
app.get("/products", authMiddleware, async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.render("products", { products, user: req.user });
  } catch (err) {
    logger.error("Erro ao carregar produtos:", err);
    res.status(500).send("Erro ao carregar produtos");
  }
});

// Rota principal
app.get("/", (req, res) => {
  res.redirect("/login");
});

// Socket.io
io.on("connection", async (socket) => {
  try {
    const products = await Product.find().lean();
    socket.emit("updateProducts", products);
  } catch (err) {
    logger.error("Erro ao carregar produtos para socket:", err);
  }
});

// Inicialização do servidor
server.listen(config.PORT, () => {
  logger.info(`🚀 Rodando em http://localhost:${config.PORT}`);
});

// Middleware de tratamento de erros
app.use(errorHandler);

module.exports = { app, io };
