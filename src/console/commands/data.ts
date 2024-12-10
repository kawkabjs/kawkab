import { Command } from '../commander';
import { stub } from '../stub';
import * as fs from 'fs';


export function DataCommand(program: Command): void {
  program
    .command('data:make <name> [module]')
    .description('Create a new data file')
    .action(async (name: string, module: string = 'main') => {
      const content = fs.readFileSync(`${__dirname}/../../storage/stubs/data.stub`);

      stub(`app/${module.toLowerCase()}/data/${name.toLowerCase()}.ts`, content.toString());

      console.log(`🆗 Data file '${name.toLowerCase()}' created successfully in module '${module.toLowerCase()}'.\n`);

      console.log('1️⃣  Your data file is ready! You can now import it like this:' +
        `\n👉 import ${name.toLowerCase()}Data from '../data/${name.toLowerCase()}'` +
        '\n\n2️⃣  Use the data like so:' +
        `\n👉 const data = ${name.toLowerCase()}Data.data` +
        '\n\nEnjoy coding! 😎');

      process.exit();
    });
}
