import { Command } from '../commander';
import { stub } from '../stub';
import * as fs from 'fs';

export function ModelCommand(program: Command): void {
  program
    .command('model:make <name> [module]')
    .description('Create a new model')
    .action(async (name: string, module: string = 'main') => {
      const content = fs.readFileSync(`${__dirname}/../../storage/stubs/model.stub`);

      stub(`app/${module.toLowerCase()}/models/${name.toLowerCase()}.ts`, content.toString(), [
        { var: 'ClassName', value: name.replace(/^\w/, c => c.toUpperCase()) }
      ]);

      console.log(`🆗 Model ${name.toLowerCase()} created successfully in module ${module.toLowerCase()}.`);

      process.exit();
    });
}