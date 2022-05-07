import { createLogger, format, transports } from "winston";

const options = {
    console: {
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true,
    },
  };

export const logger = createLogger({
    format: format.combine(
        format.timestamp({
        format: 'YYYY-MM-DD hh:mm:ss',
      }),
      format.align(),
      format.printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)),
    transports: [new transports.Console(options.console)],
  });

  export class LoggerStream {
    write(message: string) {
        logger.info(message.substring(0, message.lastIndexOf('\n')));
    }
}