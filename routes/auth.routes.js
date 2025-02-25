const express = require("express");
const User = require("../models/User");

const router = express.Router();

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
    req.session.user = { email, role: "admin" };
    return res.redirect("/products");
  }

  const user = await User.findOne({ email, password });

  if (!user) {
    return res.render("login", { error: "Credenciais inválidas!" });
  }

  req.session.user = { email: user.email, role: user.role };
  res.redirect("/products");
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

module.exports = router;
