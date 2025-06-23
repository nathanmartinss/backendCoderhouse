const express = require("express");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const path = require("path");
const http = require("http");
const { create } = require("express-handlebars");
const { Server } = require("socket.io");
const config = require("./config/config");
const { logger } = require("./config/logger");
const { addLogger } = require("./middlewares/logger.middleware");
const errorHandler = require("./middlewares/errorHandler");
const initializePassport = require("./config/passport.config");

const Product = require("./models/Product");

// Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

// App e servidor
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// View engine - Handlebars
const hbs = create({ extname: ".handlebars" });
app.engine(".handlebars", hbs.engine);
app.set("view engine", ".handlebars");
app.set("views", path.join(__dirname, "views"));

// Middlewares globais
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Logger customizado
app.use(addLogger);

// Sessões
app.use(
  session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Passport
initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// MongoDB
mongoose
  .connect(config.MONGO_URI)
  .then(() => logger.info("🔥 MongoDB conectado!"))
  .catch((err) => logger.error("❌ Erro ao conectar no MongoDB:", err));

// Rotas da aplicação
app.use("/", require("./routes/auth.routes"));
app.use("/api/sessions", require("./routes/sessions.routes"));
app.use("/api/products", require("./routes/products.routes")(io));
app.use("/api/carts", require("./routes/carts.routes"));
app.use("/api", require("./routes/mocking.routes"));
app.use("/", require("./routes/logger.routes"));
app.use("/api/users", require("./routes/users.routes"));

// Configuração do Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware de autenticação para rota protegida
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

// Rota raiz
app.get("/", (req, res) => {
  res.redirect("/login");
});

// WebSocket
io.on("connection", async (socket) => {
  try {
    const products = await Product.find().lean();
    socket.emit("updateProducts", products);
  } catch (err) {
    logger.error("Erro ao carregar produtos para socket:", err);
  }
});

// Middleware de tratamento de erros
app.use(errorHandler);

// Inicialização do servidor
server.listen(config.PORT, () => {
  logger.info(`🚀 Servidor rodando em http://localhost:${config.PORT}`);
});

module.exports = { app, io };
