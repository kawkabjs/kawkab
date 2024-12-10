import { Command } from '../commander';
import { MigrationEngine } from '../../databases/migration-engine';

export function SeedingCommand(program: Command): void {
  program
    .command('seed:run [name]')
    .description('Run database seeders. Optionally specify a seeder name to run a specific seeder.')
    .action(async (name?: string) => {
      const db: any = MigrationEngine.getConnection();

      try {
        if (name) {
          console.log(`🆗 Running seeder ${name}...`);
          // Run a specific seeder
          await db.seed.run({ specific: name });
          console.log(`🆗 Seeder ${name} ran successfully.`);
        } else {
          console.log('🆗 Running all seeders...');
          // Run all seeders
          await db.seed.run();
          console.log('🆗 All seeders ran successfully.');
        }

        // Close the process with success status
        process.exit(0);
      } catch (err) {
        console.error('🛑 Error running seeders:', err);
        process.exit(1);
      } finally {
        // Close the database connection
        await db.destroy();
      }
    });
}
