import { Command } from '../commander';
import { MigrationEngine } from '../../databases/migration-engine';

export function MigrationRollbackCommand(program: Command): void {
  program
    .command('migrate:rollback')
    .description('Rollback database migrations')
    .option('-s, --steps <number>', 'Number of steps to rollback', parseInt)
    .action(async (cmd) => {
      const db: any = MigrationEngine.getConnection();

      try {
        if (cmd.steps) {
          if (cmd.steps < 1) {
            console.error('👉 Number of steps should be at least 1');
            process.exit(0);
          }
          // Rollback a specific number of steps
          await db.migrate.rollback({ step: cmd.steps });
          console.log(`🆗 Rolled back ${cmd.steps} step(s) successfully`);
        } else {
          // Rollback all migrations
          await db.migrate.rollback();
          console.log('🆗 Rolled back all migrations successfully');
        }
      } catch (err) {
        console.error('👉 Error rolling back migrations:', err);
        process.exit(1);
      } finally {
        // Close the database connection
        await db.destroy();
      }

      process.exit();
    });
}
