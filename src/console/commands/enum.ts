import { Command } from '../commander';
import { stub } from '../stub';
import * as fs from 'fs';

export function EnumCommand(program: Command): void {
  program
    .command('enum:make <name> [module]')
    .description('Create a new enum file')
    .action(async (name: string, module: string = 'main') => {
      const content = fs.readFileSync(`${__dirname}/../../../storage/stubs/enum.stub`);

      stub(`app/${module.toLowerCase()}/enums/${name}.ts`, content.toString(), [
        { var: 'EnumName', value: name }
      ]);

      console.log(`🆗 Enum ${name.toLowerCase()} created successfully in module ${module.toLowerCase()}.`);

      console.log('\n1️⃣  Your enum file is ready! You can now import it like this:' +
                `\n👉 import { ${name}, ${name}Enum } from "../enums/${name}"` +
                '\n\n2️⃣  Use the enum like so:' +
                `\n👉 ${name}Enum.Key` +
                '\n\n3️⃣  Or use the enum like so:' +
                `\n👉 ${name}.get('key')` +
                '\n\nEnjoy coding! 😎');

      process.exit();
    });
}