import { Command } from '../commander';
import { MigrationEngine } from '../../databases/migration-engine';

export function MigrationFreshCommand(program: Command): void {
  program
    .command('migrate:fresh')
    .description('Rollback all database migrations and re-run them')
    .action(async (cmd) => {
      const db: any = MigrationEngine.getConnection();

      try {
        // Start by rolling back all migrations
        console.log('🌀 Rolling back all migrations...');
        await db.migrate.rollback();

        // Optionally, truncate all tables (to delete all data) - use with caution
        console.log('🧹 Dropping all tables...');
        const client = db.client.config.client;

        // Get the list of tables from the database
        let tables: Array<{ table_name: string }>;

        if (client === 'postgresql') {
          tables = await db('pg_tables')
            .select('tablename as table_name')
            .where('schemaname', 'public');
        } else if (client === 'mysql') {
          tables = await db('information_schema.tables')
            .select('table_name')
            .where('table_schema', db.client.config.connection.database);
        } else if (client === 'sqlite3') {
          // For SQLite, we query the sqlite_master table to get the list of tables
          tables = await db('sqlite_master')
            .select('name as table_name')
            .where('type', 'table')
            .andWhere('name', 'not like', 'sqlite_%'); // Exclude internal SQLite tables
        } else {
          throw new Error('Unsupported database client');
        }

        // Drop all tables in the database
        for (const table of tables) {
          await db.raw('DROP TABLE IF EXISTS ??', [table.table_name]);
        }

        // Re-run all migrations
        console.log('🔄 Running migrations...');
        await db.migrate.latest();

        console.log('🆗 Fresh migration completed successfully');
      } catch (err) {
        console.error('👉 Error during fresh migration:', err);
        process.exit(1);
      } finally {
        // Close the database connection
        await db.destroy();
      }

      process.exit();
    });
}
