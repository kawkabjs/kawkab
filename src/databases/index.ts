import {
  sutando,
  Attribute as AttributeModel,
  CastsAttributes as CastsModel,
} from "sutando";
import { MigrationEngine } from "./migration-engine";

export class Database {
  private static db: any;

  static getConnection(name: string | null = null) {
    if (name) {
      return sutando.connection(name);
    }

    if (!this.db) {
      this.db = sutando.connection();
    }

    return this.db;
  }

  static setConnection(connection: any) {
    this.db = sutando.connection(connection);
  }

  static query(name: string | null = null) {
    return this.getConnection(name);
  }

  static addConnectionMysql(
    host: string = "127.0.0.1",
    port: number = 3306,
    user: string = "root",
    password: string = "",
    database: string,
    connection: string = "mysql"
  ) {
    sutando.addConnection(
      {
        client: "mysql2",
        connection: {
          host: host,
          port: port,
          user: user,
          password: password,
          database: database,
        },
      },
      connection
    );

    this.setConnection(connection);
  }

  static addConnectionPgsql(
    host: string = "127.0.0.1",
    port: number = 5432,
    user: string = "postgres",
    password: string = "",
    database: string,
    connection: string = "pgsql"
  ) {
    sutando.addConnection(
      {
        client: "pg",
        connection: {
          host: host,
          port: port,
          user: user,
          password: password,
          database: database,
        },
      },
      connection
    );

    this.setConnection(connection);
  }

  static addConnectionSqlite(
    database: string = ":memory:",
    connection: string = "sqlite"
  ) {
    sutando.addConnection(
      {
        client: "sqlite3",
        connection: {
          filename: database,
          flags: ["OPEN_URI", "OPEN_SHAREDCACHE"],
        },
      },
      connection
    );

    this.setConnection(connection);
  }

  static load(
    MigrationsDirs: Array<string> = [],
    SeedsDirs: Array<string> = []
  ): void {
    MigrationEngine.loadMigrations(MigrationsDirs);
    MigrationEngine.loadSeeds(SeedsDirs);
  }
}

export { AttributeModel, CastsModel };
