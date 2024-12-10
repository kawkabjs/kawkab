import { Command } from '../commander';
import { stub } from '../stub';
import * as fs from 'fs';

export function TestIntegrationCommand(program: Command): void {
  program
    .command('test:integration <name> [module]')
    .description('Create a new integration test')
    .action(async (name: string, module: string = 'main') => {
      const content = fs.readFileSync(
        `${__dirname}/../../storage/stubs/test-integration.stub`
      );

      stub(
        `app/${module.toLowerCase()}/test/integration/${name}.ts`,
        content.toString()
      );

      console.log(
        `🆗 Integration test ${name} created successfully in module ${module.toLowerCase()}.`
      );

      console.log('\n1️⃣  Your integration test is ready!' + '\n\nEnjoy coding! 😎');

      process.exit();
    });
}
