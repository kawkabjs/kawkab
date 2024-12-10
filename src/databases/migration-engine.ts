import knex from 'knex';
import { existsSync } from 'fs';

export class MigrationEngine {
  public static knex: object = {};
  public static migrations: Array<string> = [];
  public static seeds: Array<string> = []; // Array to store seed directories

  // Load migrations
  public static loadMigrations(dirs: string[]) {
    dirs.forEach(dir => {
      if (existsSync(dir) && !this.migrations.includes(dir)) {
        this.migrations.push(dir);
      }
    });
  }

  // Load seeds
  public static loadSeeds(dirs: string[]) {
    dirs.forEach(dir => {
      if (existsSync(dir) && !this.seeds.includes(dir)) {
        this.seeds.push(dir);
      }
    });
  }

  // Set up database connection
  public static setConnection(config: { client: string; host: string; port: number; user: string; password: string; database: string; }, tableName: string = 'migrations', seedDirectories: string[] = []) {
    if (config.client !== 'mysql' && config.client !== 'pg' && config.client !== 'sqlite3') {
      throw new Error('Unsupported client. Only "mysql", "pg", and "sqlite3" are supported.');
    }

    const connection = {
      host: config.host,
      port: Number(config.port),
      user: config.user,
      password: config.password,
      database: config.database,
    };

    // Load seeds when setting up the connection
    this.loadSeeds(seedDirectories);

    return this.knex = knex({
      client: config.client,
      connection: connection,
      migrations: {
        tableName: tableName,
        directory: this.migrations,
        loadExtensions: ['.ts', '.js'],
      },
      seeds: {
        directory: this.seeds, // Set seed directories
      },
    });
  }

  // Return the current connection
  public static getConnection() {
    return this.knex;
  }
}
