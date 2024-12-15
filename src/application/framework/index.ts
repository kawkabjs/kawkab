import path from "path";
import { Server } from "../server";
import { Env } from "../../configuration/env";
import { Mail } from "../../email/mail/mail";
import { Response } from "../response";
import { Request } from "../request";
import { Encryption } from "../../security/encryption";
import { Log } from "../../security/log";
import { Password } from "../../security/password";
import { File } from "../../file-system/file";
import { Folder } from "../../file-system/folder";
import { String } from "../../data/string";
import { Number } from "../../data/number";
import { Collect } from "../../data/collect";
import { Commander, Command } from "../../console/commander";
import { Extend } from "../extend";
import { DependencyInjection } from "../../patterns/dependency-injection";
import { Singleton } from "../../patterns/singleton";
import { Module } from "../module";
import { Trans } from "../../locale/trans";
import { Config } from "../../configuration/config";
import { rule, Validation } from "../../security/validation";
import { AcceptLanguageMiddleware } from "../../middleware/accept-language-middleware";
import { Database, AttributeModel, CastsModel } from "../../databases";
import { MaintenanceModeMiddleware } from "../../middleware/maintenance-mode-middleware";
import { MigrationEngine } from "../../databases/migration-engine";
import { Respond as Resp } from "../response/resp";
import { ErrorHandler } from "../../exceptions/error-handler";
import { __ThrowHttpResponse } from "../../exceptions/errors/__throw-http-response";
import { App } from "../app";
import { Res } from "../response/res";
import { Hash } from "../../security/hash";
import { Event } from "../../events";
import { RateLimiterMiddleware } from "../../middleware/rate-limiter-middleware";
import { Cache } from "../../cache";
import { Http } from "../../http";
import { Time } from "../../time";
import { JWT } from "../../security/jwt";
import { faker as Faker } from "@faker-js/faker";
import { JobQueue } from "../../queues/job-queue";
import { CronManager } from "../../queues/cron-manager";

type ConfigFramework = {
  app: {
    serverError: {
      enable: boolean;
      debug: boolean;
      code: string;
      message: string;
    };
    notFound: {
      enable: boolean;
      code: string;
      message: string;
    };
    maintenanceMode: {
      enable: boolean;
      message: string;
    };
  };
  server: {
    port: number;
    url: string;
  };
  serverStatic: {
    enable: boolean;
    path: string;
  };
  route: {
    prefix: string;
  };
  locale: {
    default: string;
    detect: boolean;
  };
  docs: {
    title: string;
    description: string;
    path: string;
  };
  provider: any;
  database: {
    enable: boolean;
    client: string;
    connection: {
      host: string;
      port: number;
      user: string;
      password: string;
      database: string;
    };
    migrationsTableName: string;
  };
  mail: {
    host: string;
    port: number;
    user: string;
    password: string;
    tls: boolean;
    fromAddress: string;
    fromName: string;
  };
  rateLimiter: {
    enable: boolean;
    maxRequests: number;
    windowTime: number;
    code: string;
    message: string;
  };
  queue: {
    redis: {
      enable: boolean;
      host: string;
      port: number;
      password: string;
    };
  };
};

export class Framework {
  // Config
  public config: ConfigFramework | undefined;

  // Provider Class
  private providerClass: any = null;

  // Instances
  private appInstance: App = new App();
  private envInstance: Env | undefined;
  private mailInstance: Mail = new Mail();
  private encryptionInstance: Encryption | undefined;
  private logInstance: Log | undefined;
  private passwordInstance: Password | undefined;
  private hashInstance: Hash | undefined;
  private fileInstance: File | undefined;
  private folderInstance: Folder | undefined;
  private stringInstance: String | undefined;
  private numberInstance: Number | undefined;
  private collectInstance: typeof Collect | undefined;
  private transInstance: Trans | undefined;
  private configInstance: Config | undefined;
  private cacheInstance: Cache = new Cache();

  async init(config: ConfigFramework) {
    this.config = config;

    // App
    this.setApp(config);

    // Server
    const app = this.server(
      config.server.port,
      config.server.url,
      config.route.prefix,
      config.serverStatic.enable,
      config.serverStatic.path
    );

    // Mail
    this.mail();

    // Database
    this.databaseInit(
      config.database.client,
      config.database.connection.host,
      config.database.connection.port,
      config.database.connection.user,
      config.database.connection.password,
      config.database.connection.database
    );

    // Database migration engine init
    this.databaseMigrationEngineInit(
      config.database.client,
      config.database.connection.host,
      config.database.connection.port,
      config.database.connection.user,
      config.database.connection.password,
      config.database.connection.database,
      config.database.migrationsTableName
    );

    await this.setJobQueue(
      config.queue.redis.enable,
      config.queue.redis.host,
      config.queue.redis.port,
      config.queue.redis.password
    );

    // Provider
    if (config.provider) {
      this.provider(config.provider);

      if (typeof this.providerClass.boot === "function") {
        app.boot(async () => {
          await this.providerClass.boot();
          Module.getAll().forEach((module) => {
            // @ts-ignore
            if (module.instance && typeof module.instance.boot === "function") {
              // @ts-ignore
              module.instance.boot();
            }
          });
        });
      }
    }

    // Routing
    if (config.app.notFound.enable) {
      app.notFound({
        status: false,
        code: config.app.notFound.code,
        message: config.app.notFound.message,
      });

      app.addRouteNotFound();
    }

    if (config.app.serverError.enable) {
      app.setErrorHandler((err, req, res) => {
        res.writeHead(500, { "Content-Type": "application/json" });
        if (config.app.serverError.debug) {
          res.end(
            JSON.stringify({
              status: false,
              code: config.app.serverError.code,
              message: config.app.serverError.message,
              details: err.message,
              stack: this.getFormattedStack(err.stack),
            })
          );
        } else {
          res.end(
            JSON.stringify({
              status: false,
              code: config.app.serverError.code,
              message: config.app.serverError.message,
            })
          );
        }
      });
    }

    // Capture uncaught exceptions
    ErrorHandler.uncaught((error: any) => {
      try {
        if (error instanceof __ThrowHttpResponse) {
          Response.throwResponse(error);
        } else {
          if (config.app.serverError.enable) {
            if (config.app.serverError.debug) {
              Response.json(
                {
                  status: false,
                  code: config.app.serverError.code,
                  message: config.app.serverError.message,
                  details: this.getFormattedStack(error.stack),
                },
                500
              );
            } else {
              Response.json(
                {
                  status: false,
                  code: config.app.serverError.code,
                  message: config.app.serverError.message,
                },
                500
              );
            }
          }
        }
      } catch (error: any) {
        if (config.app.serverError.enable) {
          if (config.app.serverError.debug) {
            Response.json(
              {
                status: false,
                code: config.app.serverError.code,
                message: config.app.serverError.message,
                details: this.getFormattedStack(error.stack),
              },
              500
            );
          } else {
            Response.json(
              {
                status: false,
                code: config.app.serverError.code,
                message: config.app.serverError.message,
              },
              500
            );
          }
        }
      }
    });

    // Set Middleware Before Request
    app.setMiddlewareBeforeRequest(() => {
      new MaintenanceModeMiddleware(
        config.app.maintenanceMode.enable,
        config.app.maintenanceMode.message
      );

      new RateLimiterMiddleware(
        this.config!.rateLimiter.enable,
        this.config!.rateLimiter.maxRequests,
        this.config!.rateLimiter.windowTime,
        this.config!.rateLimiter.code,
        this.config!.rateLimiter.message
      );

      new AcceptLanguageMiddleware(config.locale.detect);
    });

    // Start
    if (process.env.NODE_ENV != "cli") {
      app.start();
    }

    return app;
  }

  private getFormattedStack(stack: string): string[] {
    if (!stack) return ["No error trace available"]; // Return if no error trace exists

    return stack
      .split("\n") // Split the error trace into lines
      .filter(
        (line) => !line.includes("node_modules") && !line.includes("internal")
      ) // Exclude irrelevant lines
      .map((line, index) => {
        // Add an emoji for the main error line
        if (index === 0) return `❌ ${line}`; // Main error message

        // Handle lines that start with "at"
        if (line.startsWith("at ")) {
          const match = line.match(/\((.*):(\d+):(\d+)\)/);
          if (match) {
            const filePath = match[1].replace(/\\/g, "\\"); // Use the correct path separator
            const lineNumber = match[2]; // Get the line number
            const columnNumber = match[3]; // Get the column number
            return `🔍 At: ${filePath}, 📍 Line: ${lineNumber}, 📏 Column: ${columnNumber}`; // Format the line
          }
        }

        // Match the path and line/column numbers for other lines
        const match = line.match(/\((.*):(\d+):(\d+)\)/);
        if (match) {
          const filePath = match[1].replace(/\\/g, "\\"); // Use the correct path separator
          const lineNumber = match[2]; // Get the line number
          const columnNumber = match[3]; // Get the column number
          return `🗂️ File: ${filePath}, 📍 Line: ${lineNumber}, 📏 Column: ${columnNumber}`; // Format the line
        }
        return line.trim(); // Trim and return any other lines
      })
      .filter((line) => line); // Exclude empty lines
  }

  private server(
    port: number,
    link: string,
    prefix: string = "",
    staticServerEnabled: boolean,
    staticServerPath: string
  ) {
    return new Server().init(
      port,
      link,
      Response,
      this.request(),
      prefix,
      staticServerEnabled,
      staticServerPath
    );
  }

  public setApp(config: object) {
    this.appInstance = this.appInstance.init(config);

    return this.appInstance;
  }

  public app() {
    return this.appInstance;
  }

  async setJobQueue(
    redisEnable: boolean,
    redisHost: string,
    redisPort: number,
    redisPassword: string = ""
  ) {
    const redisUrl = redisPassword
      ? `redis://:${redisPassword}@${redisHost}:${redisPort}`
      : `redis://${redisHost}:${redisPort}`;

    await JobQueue.initialize("kawkab-job-queue", redisUrl, redisEnable);
  }

  public jobQueue() {
    return JobQueue;
  }

  public cron() {
    return new CronManager();
  }

  public cache() {
    return this.cacheInstance;
  }

  public response() {
    return {
      response: Response,
      res: Res,
      resp: Resp,
    };
  }

  public request() {
    return Request;
  }

  public event() {
    return new Event();
  }

  public faker() {
    return Faker;
  }

  public env() {
    if (!this.envInstance) {
      this.envInstance = new Env().init();
    }

    return this.envInstance;
  }

  public provider(providerClass: { new (): object }) {
    const instance = new providerClass();

    if (!this.providerClass) {
      this.providerClass = instance;
    }

    return this;
  }

  public mail() {
    this.mailInstance = this.mailInstance.init({
      host: this.config?.mail.host || "",
      port: this.config?.mail.port || 587,
      secure: this.config?.mail.tls || false,
      user: this.config?.mail.user || "",
      pass: this.config?.mail.password || "",
      fromAddress: this.config?.mail.fromAddress,
      fromName: this.config?.mail.fromName,
    });

    return this.mailInstance;
  }

  public encryption() {
    if (!this.encryptionInstance) {
      this.encryptionInstance = new Encryption();
    }

    return this.encryptionInstance;
  }

  public log() {
    if (!this.logInstance) {
      this.logInstance = new Log().init();
    }

    return this.logInstance;
  }

  public hash() {
    if (!this.hashInstance) {
      this.hashInstance = new Hash();
    }

    return this.hashInstance;
  }

  public password() {
    if (!this.passwordInstance) {
      this.passwordInstance = new Password();
    }

    return this.passwordInstance;
  }

  public file() {
    if (!this.fileInstance) {
      this.fileInstance = new File();
    }

    return this.fileInstance;
  }

  public folder() {
    if (!this.folderInstance) {
      this.folderInstance = new Folder();
    }

    return this.folderInstance;
  }

  public string() {
    if (!this.stringInstance) {
      this.stringInstance = new String();
    }

    return this.stringInstance;
  }

  public number() {
    if (!this.numberInstance) {
      this.numberInstance = new Number();
    }

    return this.numberInstance;
  }

  public collect() {
    if (!this.collectInstance) {
      this.collectInstance = Collect;
    }

    return this.collectInstance;
  }

  public trans() {
    if (!this.transInstance) {
      this.transInstance = new Trans();
    }

    this.transInstance.load([path.join(__dirname, "../../../storage/trans")]);

    if (this?.config?.locale.default) {
      const locale = (this?.config?.locale.default || "en").trim();

      this.transInstance.setDefaultLocale(locale);
      this.transInstance.setLocale(locale);
    }

    return this.transInstance;
  }

  public configuration() {
    if (!this.configInstance) {
      this.configInstance = new Config();
    }

    return this.configInstance;
  }

  public validation() {
    return Validation;
  }

  public rule() {
    return rule;
  }

  public commander() {
    return {
      commander: new Commander(),
      command: Command,
    };
  }

  public extend() {
    return Extend;
  }

  public time() {
    return Time;
  }

  public http() {
    return Http;
  }

  public jwt() {
    return JWT;
  }

  public designPatterns() {
    return {
      dependencyInjection: DependencyInjection,
      singleton: Singleton,
    };
  }

  public databaseInit(
    client: string,
    host: string,
    port: number,
    user: string,
    password: string,
    database: string
  ) {
    const name = "default";

    switch (client) {
      case "mysql":
        Database.addConnectionMysql(host, port, user, password, database, name);
        break;
      case "pgsql":
        Database.addConnectionPgsql(host, port, user, password, database, name);
        break;
      case "sqlite":
        Database.addConnectionSqlite(database, name);
        break;
      default:
        Database.addConnectionMysql(host, port, user, password, database, name);
    }
  }

  public databaseMigrationEngineInit(
    client: string,
    host: string,
    port: number,
    user: string,
    password: string,
    database: string,
    migrationsTableName: string = "migrations"
  ) {
    // Directories
    MigrationEngine.loadMigrations([`${__dirname}/../../databases/migrations`]);

    // Connection
    switch (client) {
      case "mysql":
        client = "mysql";
        break;
      case "pgsql":
        client = "pg";
        break;
      case "sqlite":
        client = "sqlite3";
        break;
      default:
        client = "mysql";
    }

    MigrationEngine.setConnection(
      {
        client: client,
        host: host,
        port: port,
        user: user,
        password: password,
        database: database,
      },
      migrationsTableName
    );
  }

  public database() {
    return {
      database: Database,
      attributeModel: AttributeModel,
      castsModel: CastsModel,
    };
  }
}
