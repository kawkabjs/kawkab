import { Command } from '../commander';
import { stub } from '../stub';
import * as fs from 'fs';

export function SeederCommand(program: Command): void {
  program
    .command('seed:make <name> [module]')
    .description('Create a new seeder file')
    .action(async (name: string, module: string = 'main') => {
      const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
      const fileName = `${timestamp}_${name.toLowerCase()}.ts`;
      const content = fs.readFileSync(`${__dirname}/../../storage/stubs/seed.stub`);

      stub(`app/${module.toLowerCase()}/seeds/${fileName}`, content.toString(), [
        { var: 'ItemName', value: name.replace(/^\w/, c => c.toUpperCase()) }
      ]);

      console.log(`🆗 Seeder '${fileName}' created successfully in module '${module.toLowerCase()}'.\n`);

      process.exit();
    });
}