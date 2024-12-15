import { Framework } from './application/framework';
import { BaseAction } from './bases/base-action';
import { BaseController } from './bases/base-controller';
import { BaseEnum } from './bases/base-enum';
import { BaseEvent } from './bases/base-event';
import { BaseMiddleware } from './bases/base-middleware';
import { BaseModule } from './bases/base-module';
import { BaseProvider } from './bases/base-provider';
import { BaseRepository } from './bases/base-repository';
import { BaseService } from './bases/base-service';
import { BaseValidation } from './bases/base-validation';
import { BaseDTO } from './bases/base-dto';
import { BaseModel } from './bases/base-model';
import { BaseResource } from './bases/base-resource';
import { PasswordCastAttribute } from './databases/casts/password';
import { BaseCache } from './bases/base-cache';
import { BaseNotification } from './bases/base-notifications';
import { BaseFactory } from './bases/base-factory';
import { BaseJob } from './bases/base-job';
import { BaseCronJob, CronJobDayOfWeekEnum } from './bases/base-cron-job';
import { Command } from './console/commander';
import { BaseHttp, HttpMethodEnum } from './bases/base-http';

// Application
const framework = new Framework();
const app = framework.app();
const { response, res, resp } = framework.response();
const request = framework.request();
const extend = framework.extend();
const { database, attributeModel, castsModel } = framework.database();

// Event
const event = framework.event();

// Configuration
const env = framework.env();
const config = framework.configuration();

// Email
const mail = framework.mail();

// Security
const encryption = framework.encryption();
const log = framework.log();
const password = framework.password();
const hash = framework.hash();
const jwt = framework.jwt();

// Validation
const validation = framework.validation();
const rule: ReturnType<typeof framework.rule> = framework.rule();

// File System
const file = framework.file();
const folder = framework.folder();

// Data
const string = framework.string();
const number = framework.number();
const collect = framework.collect();
const faker = framework.faker();

// Cache
const cache = framework.cache();

// Console
const { commander, command } = framework.commander();

// Http
const http = framework.http();

// Time
const time = framework.time();

// Job Queue
const jobQueue = framework.jobQueue();
const cron = framework.cron();

// Locale
const trans = framework.trans();
const t = (
  key: string,
  replacements: Record<string, string> = {},
  fallback?: string,
  locale?: string
) =>
  trans.get?.(key, replacements, fallback, locale) ??
  (() => {
    throw new Error('The \'get\' method is not available on \'trans\'.');
  })();

// Design Patterns
const { dependencyInjection, singleton } = framework.designPatterns();

export {
  // Application
  framework,
  framework as kawkab,
  app,
  response,
  res,
  resp,
  resp as respond,
  request,
  request as req,
  extend,
  extend as inherit,
  extend as inh,

  // Event
  event,

  // Cache
  cache,

  // Configuration
  env,
  config,

  // Email
  mail,

  // Security
  encryption,
  log,
  password,
  hash,
  jwt,

  // Validation
  validation,
  rule,

  // File System
  file,
  folder,

  // Data
  string,
  number,
  collect,
  faker,

  // Console
  commander,
  command,
  Command,

  // Http
  http,

  // Job Queue
  jobQueue,
  cron,

  // Locale
  trans,
  t,
  t as __,

  // Time
  time,

  // Databases
  database,
  database as db,
  attributeModel as AttributeModel,
  castsModel as CastsModel,

  // Bases
  BaseProvider,
  BaseModule,
  BaseController,
  BaseService,
  BaseValidation,
  BaseDTO,
  BaseEnum,
  BaseEvent,
  BaseAction,
  BaseMiddleware,
  BaseRepository,
  BaseModel,
  BaseResource,
  BaseCache,
  BaseHttp,
  BaseNotification,
  BaseFactory,
  BaseJob,
  BaseCronJob,

  // Enums
  HttpMethodEnum,
  CronJobDayOfWeekEnum,
  
  // Casts Attributes
  PasswordCastAttribute,

  // Design Patterns
  dependencyInjection as Inject,
  singleton as Single,
};
