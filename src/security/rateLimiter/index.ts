import NodeCache from 'node-cache';

// RateLimiter class to manage rate limiting logic
export class RateLimiter {
  private maxRequests: number;  // Maximum allowed requests
  private windowTime: number;   // Time window in milliseconds
  private requestLogsCache: NodeCache; // Cache instance to store request logs

  // Constructor to initialize the rate limiter with maxRequests and windowTime
  constructor(maxRequests: number, windowTime: number) {
    this.maxRequests = maxRequests;
    this.windowTime = windowTime;
    this.requestLogsCache = new NodeCache({ stdTTL: windowTime / 1000, checkperiod: 600 });
  }

  // Method to check if a request is allowed for a specific IP address
  isRequestAllowed(ip: string): boolean {
    const currentTime = Date.now();
    let logs = this.requestLogsCache.get<number[]>(ip) || [];

    // Filter out logs outside the time window
    logs = logs.filter((timestamp: number) => currentTime - timestamp < this.windowTime);

    // Check if the number of requests is within the allowed limit
    if (logs.length < this.maxRequests) {
      logs.push(currentTime); // Log the current timestamp
      this.requestLogsCache.set(ip, logs); // Store logs in cache
      return true;  // Allow the request
    }

    return false;  // Deny the request if the limit is exceeded
  }

  // Method to reset all request logs (flush cache)
  reset(): void {
    this.requestLogsCache.flushAll(); // Clear all cache data
  }

  // Method to get the request logs for an IP
  getRequestLogs(ip: string): number[] {
    return this.requestLogsCache.get(ip) || [];
  }
}
