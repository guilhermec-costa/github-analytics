import env from "../../../env";
import { ILogger } from "./ILogger";
import winston, { Logger } from "winston";

export default class WinstonLogger implements ILogger {

  private logger: Logger = winston.createLogger({
    format: winston.format.combine(
      winston.format.errors({stack: true}),
      winston.format.colorize({ all: true }),
      winston.format.timestamp({
        format: 'YYYY-MM-DD hh:mm:ss.SSS A',
      }),
      winston.format.align(),
      winston.format.printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
    ),
    level: env.LOG_LEVEL || "info",
    transports: [
      new winston.transports.Console()
    ],
  });

  log(message: string): void {
    this.logger.info(message)
  }
  error(message: string): void {
    this.logger.error(message);
  }

}