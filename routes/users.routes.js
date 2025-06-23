const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { isAdmin } = require("../middlewares/auth.middleware");
const nodemailer = require("nodemailer");

router.get("/", isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, "name email role");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
});

router.delete("/", isAdmin, async (req, res) => {
  try {
    const limite = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    const users = await User.find({ lastConnection: { $lt: limite } });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    for (const user of users) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Conta excluída por inatividade",
        text: "Sua conta foi excluída por ficar inativa."
      });
      await User.deleteOne({ _id: user._id });
    }
    res.json({ message: "Usuários inativos excluídos", count: users.length });
  } catch (err) {
    res.status(500).json({ error: "Erro ao excluir usuários" });
  }
});

router.get("/admin", isAdmin, async (req, res) => {
  const users = await User.find({}, "name email role");
  res.render("usersAdmin", { users });
});

router.post("/:uid/role", isAdmin, async (req, res) => {
  await User.findByIdAndUpdate(req.params.uid, { role: req.body.role });
  res.redirect("/api/users/admin");
});

router.post("/:uid/delete", isAdmin, async (req, res) => {
  await User.findByIdAndDelete(req.params.uid);
  res.redirect("/api/users/admin");
});

module.exports = router;