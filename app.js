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

app.use(
  session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

require("./config/passport.config")(passport);
app.use(passport.initialize());
app.use(passport.session());

mongoose
  .connect(config.MONGO_URI)
  .then(() => console.log("🔥 MongoDB conectado!"))
  .catch((err) => console.error(err));

app.use("/", require("./routes/auth.routes"));
app.use("/api/products", require("./routes/products.routes")(io));
app.use("/api/carts", require("./routes/carts.routes"));

const authMiddleware = (req, res, next) => {
  if (!req.isAuthenticated()) return res.redirect("/login");
  next();
};

app.get("/products", authMiddleware, async (req, res) => {
  const products = await Product.find().lean();
  res.render("products", { products, user: req.user });
});

app.get("/", (req, res) => {
  res.redirect("/login");
});

io.on("connection", async (socket) => {
  const products = await Product.find().lean();
  socket.emit("updateProducts", products);
});

server.listen(config.PORT, () =>
  console.log(`🚀 Rodando em http://localhost:${config.PORT}`)
);

module.exports = { app, io };
