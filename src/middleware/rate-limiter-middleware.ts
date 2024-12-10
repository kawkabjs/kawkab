import { request, respond } from '..';
import { RateLimiter } from '../security/rateLimiter';

export class RateLimiterMiddleware {
  private static rateLimiter: RateLimiter | undefined;  // Static property to store the RateLimiter instance

  constructor(
    enable: boolean = true,
    maxRequests: number = 100,
    windowTime: number = 60 * 1000,
    code: string = 'too-many-requests',
    message: string = 'Too many requests. Please try again later.'
  ) {
    if (!enable) return;

    // Initialize RateLimiter only if it's not already initialized
    if (!RateLimiterMiddleware.rateLimiter) {
      RateLimiterMiddleware.rateLimiter = new RateLimiter(maxRequests, windowTime);
    }

    // Get the IP address
    const ip = request.ip() ?? 'localhost';

    // Check if the request is allowed using the static RateLimiter instance
    if (!RateLimiterMiddleware.rateLimiter!.isRequestAllowed(ip)) {
      respond.tooManyRequests({
        status: false,
        code: code,
        message: message,
      });
    }
  }
}
