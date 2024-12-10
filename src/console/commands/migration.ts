import { Command } from '../commander';
import { stub } from '../stub';
import * as fs from 'fs';

export function MigrationCommand(program: Command): void {
  program
    .command('migrate:make <name> [module]')
    .description('Create a new migration file')
    .action(async (name: string, module: string = 'main') => {
      const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
      const fileName = `${timestamp}_${name.toLowerCase()}.ts`;
      const content = fs.readFileSync(`${__dirname}/../../storage/stubs/migration.stub`);

      stub(`app/${module.toLowerCase()}/migrations/${fileName}`, content.toString(), [
        { var: 'TableName', value: name.replace(/^\w/, c => c.toLowerCase()) }
      ]);

      console.log(`🆗 Migration '${fileName}' created successfully in module '${module.toLowerCase()}'.\n`);

      process.exit();
    });
}