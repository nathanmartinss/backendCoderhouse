const express = require("express");
const { generateMockProducts } = require("../utils/mocking.utils");

const router = express.Router();

router.get("/mockingproducts", (req, res) => {
  const mockProducts = generateMockProducts();
  res.json(mockProducts);
});

module.exports = router;
