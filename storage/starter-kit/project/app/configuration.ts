import { Provider } from "./provider";
import { env } from "kawkab";

// Main configuration object for the application
export const app = {
  // Provider to be used for managing application dependencies or state
  provider: Provider,

  // Application-specific settings
  app: {
    // Server error configuration
    serverError: {
      enable: true, // Enable server error handling
      debug: env.bool("APP_DEBUG"), // Enable debug mode based on environment variable
      code: "server_error", // Error code for server errors
      message: env.bool("APP_DEBUG") // Message based on debug mode
        ? "Server Error"
        : "An unexpected error occurred", // Message displayed when an error occurs
    },
    // Not found error configuration
    notFound: {
      enable: true, // Enable handling for "not found" errors
      code: "not_found", // Error code for "not found" errors
      message: "Not found", // Default message when the resource is not found
    },
    // Maintenance mode settings
    maintenanceMode: {
      enable: env.bool("APP_MAINTENANCE_MODE"), // Enable maintenance mode based on environment variable
      message: "Service Unavailable", // Message displayed during maintenance mode
    },
  },

  // Server configuration
  server: {
    port: env.number("SERVER_PORT", 3000), // Server port with a default value of 3000
    url: env.string("SERVER_URL", "http://localhost"), // Server URL with a default value of 'http://localhost'
  },

  // Static file server configuration
  serverStatic: {
    enable: true, // Enable static file serving
    path: "/public", // Directory path for static files
  },

  // API route configuration
  route: {
    prefix: "/api", // Prefix for API routes
  },

  // Rate limiter settings
  rateLimiter: {
    enable: true, // Enable rate limiting
    maxRequests: 100, // Maximum number of requests allowed per window time
    windowTime: 60 * 1000, // Window time in milliseconds (1 minute)
    code: "too-many-requests", // Error code for rate limiting
    message: "Too many requests. Please try again later.", // Error message when rate limit is exceeded
  },

  // Localization settings
  locale: {
    default: env.string("LOCALE_CODE", "en"), // Default locale code, with fallback to 'en'
    detect: true, // Enable automatic locale detection based on user's preferences or location
  },

  // Documentation configuration
  docs: {
    enable: true, // Enable API documentation
    title: "API Documentation", // Documentation title
    description: "Documentation for API endpoints.", // Description of the documentation
    path: "storage/private/docs", // Path to documentation files
  },

  // Database connection settings
  database: {
    enable: true, // Enable database integration
    client: env.get("DATABASE_CLIENT"), // Database client type (e.g., mysql, postgres)
    connection: {
      host: env.get("DATABASE_HOST"), // Database host address
      port: env.int("DATABASE_PORT"), // Database port
      user: env.get("DATABASE_USER"), // Database username
      password: env.get("DATABASE_PASSWORD"), // Database password
      database: env.get("DATABASE_NAME"), // Database name
    },
    migrationsTableName: "migrations", // Table name for migrations in the database
  },

  // Mail service configuration
  mail: {
    host: env.string("MAIL_HOST"), // Mail server host
    port: env.number("MAIL_PORT"), // Mail server port
    user: env.string("MAIL_USER"), // Mail server username
    password: env.string("MAIL_PASS"), // Mail server password
    tls: env.bool("MAIL_TLS"), // Enable TLS for secure mail communication
    fromAddress: env.string("MAIL_FROM_ADDRESS"), // Default "from" email address used in sent emails
    fromName: env.string("MAIL_FROM_NAME"), // Default "from" name used in sent emails
  },

  // Queue settings for job processing
  queue: {
    redis: {
      enable: env.bool("QUEUE_ENABLE_REDIS", false), // Enable Redis for job queueing
      host: env.string("QUEUE_REDIS_HOST", "127.0.0.1"), // Redis server host address
      port: env.number("QUEUE_REDIS_PORT", 6379), // Redis server port
      password: env.string("QUEUE_REDIS_PASSWORD", ""), // Redis server password
    },
  },
};
