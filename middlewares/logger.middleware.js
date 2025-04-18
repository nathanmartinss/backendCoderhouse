const { logger } = require("../config/logger");

const addLogger = (req, res, next) => {
  req.logger = logger; // Adiciona o logger ao objeto req
  logger.debug(`Requisição recebida: ${req.method} ${req.url}`);
  next();
};

module.exports = { addLogger };
