import { __ThrowHttpResponse } from '../errors/__throw-http-response';

export class ErrorHandler {
  // Method to handle uncaught exceptions
  static uncaught(customErrorHandler: (error: Error) => void): void {
    process.on('uncaughtException', (error) => {
      customErrorHandler(error);
    });
  }
}