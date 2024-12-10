import { Command } from '../commander';
import { stub } from '../stub';
import * as fs from 'fs';

export function ControllerCommand(program: Command): void {
  program
    .command('controller:make [path] [module]')
    .description('Create a new controller')
    .action(async (path: string = '/', module: string = 'main') => {

      // Controller 
      const content = fs.readFileSync(`${__dirname}/../../storage/stubs/controller.stub`);
      stub(`app/${module.toLowerCase()}/controllers/${path.toLowerCase()}/index.ts`, content.toString());
      console.log(`🆗 Controller created successfully in module '${module.toLowerCase()}'.\n`);

      process.exit();
    });
}