function isUser(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "user") {
    return next();
  }
  return res
    .status(403)
    .json({ message: "Acesso permitido apenas para usuários." });
}

function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "admin") {
    return next();
  }
  return res
    .status(403)
    .json({ message: "Acesso permitido apenas para administradores." });
}

function isAuthenticated(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
}

async function checkCartOwnership(req, res, next) {
  try {
    const cart = await Cart.findById(req.params.cid);
    if (!cart)
      return res.status(404).json({ message: "Carrinho não encontrado" });
    if (cart.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Acesso não autorizado a este carrinho" });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  isUser,
  isAdmin,
  isAuthenticated,
};
