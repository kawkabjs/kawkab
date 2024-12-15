import { Command } from '../commander';
import { stub } from '../stub';
import * as fs from 'fs';

export function DtoCommand(program: Command): void {
  program
    .command('dto:make <name> [module]')
    .description('Create a new DTO class')
    .action(async (name: string, module: string = 'main') => {
      const content = fs.readFileSync(`${__dirname}/../../../storage/stubs/dto.stub`);

      stub(`app/${module.toLowerCase()}/dto/${name.toLowerCase()}.ts`, content.toString(), [
        { var: 'ClassName', value: name.replace(/^\w/, c => c.toUpperCase()) }
      ]);

      console.log(`🆗 DTO ${name.toLowerCase()} created successfully in module ${module.toLowerCase()}.`);

      console.log('\n1️⃣  Your DTO class is ready! You can now use it like this:' +
        `\n 👉 import { ${name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()}DTO } from '../dto/${name.toLowerCase()}'` +
        '\n\n If no data is passed, it will automatically retrieve data from the request. like this:' +
        `\n👉 new ${name.charAt(0).toUpperCase() + name.slice(1)}DTO()` +
        '\n\n2️⃣  You can also pass data to the DTO like this:' +
        `\n👉 new ${name.charAt(0).toUpperCase() + name.slice(1)}DTO({` +
        '\n    id: 1,' +
        '\n    name: "Hassan",' +
        '\n})' +
        '\n\nEnjoy coding! 😎');

      process.exit();
    });
}
