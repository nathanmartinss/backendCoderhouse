const winston = require("winston");

const levels = {
  debug: 0,
  http: 1,
  info: 2,
  warning: 3,
  error: 4,
  fatal: 5,
};

const buildLogger = (env) => {
  return winston.createLogger({
    levels,
    level: env === "production" ? "info" : "debug", // Mostra mais logs em desenvolvimento
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${message}`;
      })
    ),
    transports: [
      new winston.transports.Console(), // Sempre exibe no console
      ...(env === "production"
        ? [
            new winston.transports.File({
              filename: "errors.log",
              level: "error",
            }),
          ]
        : []),
    ],
  });
};

const logger = buildLogger(process.env.NODE_ENV || "development");

module.exports = { logger };
