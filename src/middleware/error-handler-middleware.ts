import { IncomingMessage, ServerResponse } from 'http';

export class ErrorHandlerMiddleware {
  static handleError(err: any, req: IncomingMessage, res: ServerResponse): void {
    // Determine the type of error
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Log the error to the console
    console.error(`Error: ${message}, Status Code: ${statusCode}`);

    // Send a JSON response to the client
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = statusCode; // Set the status code
    res.end(JSON.stringify({
      success: false,
      message: message,
      // Optionally include stack trace in development
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    }));
  }
}
