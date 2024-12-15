import { Command } from '../commander';
import { stub } from '../stub';
import * as fs from 'fs';

export function CommandCommand(program: Command): void {
  program
    .command('command:make <name> [module]')
    .description('Create a new command')
    .action(async (name: string, module: string = 'main') => {
      const content = fs.readFileSync(
        `${__dirname}/../../../storage/stubs/command.stub`
      );

      stub(
        `app/${module.toLowerCase()}/commands/${name}.ts`,
        content.toString(),
        []
      );

      console.log(
        `🆗 Command ${name} created successfully in module ${module.toLowerCase()}.`
      );

      console.log('\n1️⃣  Your command file is ready! \n\nEnjoy coding! 😎');

      process.exit();
    });
}
