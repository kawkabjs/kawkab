import { Command } from '../commander';
import { stub } from '../stub';
import * as fs from 'fs';

export function ModuleCommand(program: Command): void {
  program
    .command('module:make <name>')
    .description('Create a new module')
    .action(async (name: string) => {
      const content = fs.readFileSync(`${__dirname}/../../../storage/stubs/module.stub`);

      stub(`app/${name}/module.ts`, content.toString(), [
        { var: 'ItemName', value: name.toLowerCase()}
      ]);

      console.log(`🆗 Module ${name} created successfully in project.`);

      process.exit();
    });
}
