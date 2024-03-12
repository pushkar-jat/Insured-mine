const winston = require("winston");

function initializeLogger() {
  // no using winston.createLogger as configuring the default logger
  // allows us to simply require winston in any other file and use
  // the logger without reconfiguring it
  winston.configure({
    level: process.env.Environment == "production" ? "info" : "debug",
    transports: [
      new winston.transports.File({
        filename: "logs/error.log",
        level: "error",
        maxsize: 5242880,
        maxFiles: 5,
      }),
      new winston.transports.File({
        filename: "logs/combined.log",
        maxsize: 5242880,
        maxFiles: 5,
      }),
    ],
    format: winston.format.combine(
      winston.format.timestamp({ format: "YYYY-DD-MM HH:mm:ss.SSS" }),
      // winston.format.align(),
      // winston.format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}: ${info.stack}`),
      winston.format.json()
    ),
  });

  return winston;
}

module.exports = {
  initializeLogger: initializeLogger,
};
