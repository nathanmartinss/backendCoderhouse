const express = require("express");
const router = express.Router();
const UserDTO = require("../dto/UserDTO");

router.get("/current", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Não autenticado" });
  }

  const safeUser = new UserDTO(req.user);
  res.json(safeUser);
});

module.exports = router;
