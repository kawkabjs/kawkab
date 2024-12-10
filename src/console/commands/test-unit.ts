import { Command } from '../commander';
import { stub } from '../stub';
import * as fs from 'fs';

export function TestUnitCommand(program: Command): void {
  program
    .command('test:unit <name> [module]')
    .description('Create a new unit test')
    .action(async (name: string, module: string = 'main') => {
      const content = fs.readFileSync(
        `${__dirname}/../../storage/stubs/test-unit.stub`
      );

      stub(
        `app/${module.toLowerCase()}/test/unit/${name}.ts`,
        content.toString()
      );

      console.log(
        `🆗 Unit test ${name} created successfully in module ${module.toLowerCase()}.`
      );

      console.log('\n1️⃣  Your unit test is ready!' + '\n\nEnjoy coding! 😎');

      process.exit();
    });
}
