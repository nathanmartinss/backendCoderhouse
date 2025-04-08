const errorDictionary = require("../utils/errorDictionary");

const errorHandler = (err, req, res, next) => {
  const error =
    errorDictionary[err.code] || errorDictionary.INTERNAL_SERVER_ERROR;
  res.status(error.code).json({ error: error.message });
};

module.exports = errorHandler;
