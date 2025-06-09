import { injectable } from "inversify";
import { format, createLogger, transports, LogCallback } from "winston";
import { TransformableInfo } from "logform";

const { colorize, combine, label, printf, timestamp, uncolorize } = format;

const isSilent =
  process.env["LOG_SILENT"] === "true" ||
  process.env["NODE_ENV"] === "test" ||
  process.env["LOG_GRAPHQL"] === "false";

const shouldColorize =
  process.stdout.isTTY &&
  process.env["NODE_ENV"] !== "production" &&
  process.env["NODE_ENV"] !== "CI";

@injectable()
export class Logger {
  private logger = createLogger({
    level: isSilent ? "error" : "debug", // Level doesn't matter if silent
    silent: isSilent, // <--- This is the key line!
    format: combine(
      label({ label: "[LOGGER]" }),
      timestamp({
        format: "MMM-DD-YYYY HH:mm:ss",
      }),
      shouldColorize ? colorize({ all: true }) : uncolorize(),
      printf(function (
        info: TransformableInfo & { label?: string; timestamp?: string },
      ) {
        return `\x1B[33m\x1B[3[${String(info["label"] ?? "")}\x1B[23m\x1B[39m \x1B[32m${String(info["timestamp"] ?? "")}\x1B[39m ${String(info.level)} : ${String(info.message)}`;
      }),
    ),
    transports: [new transports.Console()],
  });

  public info(message: string, callback?: LogCallback) {
    this.logger.info(message, callback);
  }

  public warn(message: string, callback?: LogCallback) {
    this.logger.warn(message, callback);
  }

  public error(message: string, callback?: LogCallback) {
    this.logger.error(message, callback);
  }

  public debug(message: string, callback?: LogCallback) {
    this.logger.debug(message, callback);
  }
}
