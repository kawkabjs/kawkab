import { createLogger, format, transports, Logger } from 'winston';
import path from 'path'; // Import the path module

export class Log {
  private logger: Logger | undefined;

  /**
     * Initializes the logger with default settings.
     * @param logFile - The name of the log file to write to. Default is 'app.log'.
     */
  public init(logFile: string = path.join(process.cwd(), 'app.log')) {
    // Resolve the log file path to the project root directory
    const logFilePath = logFile;

    // Create the logger instance
    this.logger = createLogger({
      level: 'silly', // Set the lowest logging level to capture all messages
      format: format.combine(
        format.timestamp(), // Add timestamps to log messages
        format.printf(({ level, message, timestamp }) => {
          return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
      ),
      transports: [
        // File transport for persistent logs
        new transports.File({
          filename: logFilePath,
          format: format.printf(({ level, message, timestamp }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
          })
        }),
        // Console transport for real-time logs
        new transports.Console({
          format: format.combine(
            format.colorize(), // Add colors to console output
            format.timestamp(),
            format.printf(({ level, message, timestamp }) => {
              return `${timestamp} [${level.toUpperCase()}]: ${message}`;
            })
          )
        })
      ],
    });

    return this;
  }

  /**
     * Logs a custom message with the specified level.
     * @param level - The log level (e.g., 'info', 'error').
     * @param message - The log message.
     */
  message(level: string, message: string) {
    if (this.logger) {
      this.logger.log({ level, message });
    }
  }

  /**
     * Logs an error message.
     * @param message - The error message.
     */
  error(message: string) {
    if (this.logger) {
      this.logger.error(message);
    }
  }

  /**
     * Logs a warning message.
     * @param message - The warning message.
     */
  warn(message: string) {
    if (this.logger) {
      this.logger.warn(message);
    }
  }

  /**
     * Logs an informational message.
     * @param message - The informational message.
     */
  info(message: string) {
    if (this.logger) {
      this.logger.info(message);
    }
  }

  /**
     * Logs a verbose message.
     * @param message - The verbose message.
     */
  verbose(message: string) {
    if (this.logger) {
      this.logger.verbose(message);
    }
  }

  /**
     * Logs a debug message.
     * @param message - The debug message.
     */
  debug(message: string) {
    if (this.logger) {
      this.logger.debug(message);
    }
  }

  /**
     * Logs a silly message (lowest log level).
     * @param message - The silly message.
     */
  silly(message: string) {
    if (this.logger) {
      this.logger.silly(message);
    }
  }
}