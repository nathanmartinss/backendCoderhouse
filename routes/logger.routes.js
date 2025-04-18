const express = require("express");
const router = express.Router();

router.get("/loggerTest", (req, res) => {
  req.logger.debug("Log de debug");
  req.logger.http("Log de http");
  req.logger.info("Log de info");
  req.logger.warning("Log de warning");
  req.logger.error("Log de error");
  req.logger.fatal("Log de fatal");

  res.send("Logs gerados com sucesso!");
});

module.exports = router;
