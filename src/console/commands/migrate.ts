import { Command } from '../commander';
import { MigrationEngine } from '../../databases/migration-engine';

export function MigrateCommand(program: Command): void {
  program
    .command('migrate:run')
    .description('Run database migrations')
    .action(async () => {
      const db: any = MigrationEngine.getConnection();
      
      if(MigrationEngine.knex === null || MigrationEngine.migrations.length === 0) {
        console.log('👉 No migrations found');
        process.exit(0);
      }

      try {
        // Run migrations
        await db.migrate.latest();
        console.log('🆗 Migrations ran successfully');
      } catch (err) {
        console.error('Error running migrations:', err);
        process.exit(1);
      } finally {
        // Close the database connection
        await db.destroy();
        process.exit(0);
      }
    });
}