import * as winston from "winston";
import "winston-daily-rotate-file";
import * as fs from "fs";
import config from "../config";

const transports = [];
if (process.env.NODE_ENV !== "development") {
  transports.push(new winston.transports.Console());
} else {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.cli(),
        winston.format.splat()
      ),
    })
  );
}

if (!fs.existsSync(config.logs.logDir)) {
  fs.mkdirSync(config.logs.logDir);
}

transports.push(
  new winston.transports.DailyRotateFile({
    level: "debug",
    filename: `${config.logs.logDir}/%DATE%-smart-push.log`,
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
  })
);

const LoggerInstance = winston.createLogger({
  level: config.logs.level,
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports,
});

export default LoggerInstance;
