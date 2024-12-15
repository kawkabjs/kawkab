import { Command } from '../commander';
import { MigrationEngine } from '../../databases/migration-engine';

export function MigrationFreshCommand(program: Command): void {
  program
    .command('migrate:fresh')
    .description('Rollback all database migrations and re-run them')
    .action(async (cmd) => {
      const db: any = MigrationEngine.getConnection();

      try {
        console.log('🧹 Dropping all tables...');
        const client = db.client.config.client;

        let tables;

        if (client === 'postgresql') {
          console.log('🔧 Disabling foreign key constraints...');
          await db.raw('SET session_replication_role = replica');

          tables = await db('pg_tables')
            .select('tablename')
            .where('schemaname', 'public');

          if (!tables || tables.length === 0) {
            console.log('📋 No tables to drop.');
            return;
          }

          console.log('📋 Tables to drop:', tables.map((t: { tablename: string; }) => t.tablename).join(', '));

          for (const table of tables) {
            if (table.tablename) {
              console.log(`Dropping table: ${table.tablename}`);
              await db.raw('DROP TABLE IF EXISTS ?? CASCADE', [table.tablename]);
            } else {
              console.log(' Skipping table with undefined name.');
            }
          }

          console.log('🔧 Enabling foreign key constraints...');
          await db.raw('SET session_replication_role = DEFAULT');
        } else if (client === 'mysql') {
          console.log('🔧 Disabling foreign key constraints...');
          await db.raw('SET FOREIGN_KEY_CHECKS = 0');

          tables = await db('information_schema.tables')
            .select('TABLE_NAME')
            .where('TABLE_SCHEMA', db.client.config.connection.database);


          if (!tables || tables.length === 0) {
            console.log('📋 No tables to drop.');
            return;
          }

          console.log('📋 Tables to drop:', tables.map((t: { TABLE_NAME: string; }) => t.TABLE_NAME).join(', '));

          for (const table of tables) {
            if (table.TABLE_NAME) {
              console.log(`Dropping table: ${table.TABLE_NAME}`);
              await db.raw('DROP TABLE IF EXISTS ??', [table.TABLE_NAME]);
            } else {
              console.log(' Skipping table with undefined name.');
            }
          }

          console.log('🔧 Enabling foreign key constraints...');
          await db.raw('SET FOREIGN_KEY_CHECKS = 1');
        } else if (client === 'sqlite3') {
          tables = await db('sqlite_master')
            .select('name')
            .where('type', 'table')
            .andWhere('name', 'not like', 'sqlite_%');

          console.log('Tables:', tables); // Debug output

          if (!tables || tables.length === 0) {
            console.log('📋 No tables to drop.');
            return;
          }

          console.log('📋 Tables to drop:', tables.map((t: { name: string; }) => t.name).join(', '));

          for (const table of tables) {
            if (table.name) {
              console.log(`Dropping table: ${table.name}`);
              await db.raw('DROP TABLE IF EXISTS ??', [table.name]);
            } else {
              console.log(' Skipping table with undefined name.');
            }
          }

          console.log('🧹 Performing VACUUM...');
          await db.raw('VACUUM');
        } else {
          throw new Error('Unsupported database client');
        }

        console.log('🔄 Running migrations...');
        // Uncomment this to actually run the migrations
        await db.migrate.latest();

        console.log('🆗 Fresh migration completed successfully');
      } catch (err) {
        console.error('👉 Error during fresh migration:', err);
        process.exit(1);
      } finally {
        await db.destroy();
      }

      process.exit();
    });
}
