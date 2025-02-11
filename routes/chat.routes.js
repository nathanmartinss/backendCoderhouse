const express = require("express");
const Message = require("../models/Message");

const router = express.Router();

router.get("/", async (req, res) => {
  const messages = await Message.find();
  res.render("chat", { messages });
});

router.post("/", async (req, res) => {
  const { user, message } = req.body;
  await Message.create({ user, message });
  res.redirect("/chat");
});

module.exports = router;
