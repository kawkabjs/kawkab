import { Command } from '../commander';
import { stub } from '../stub';
import * as fs from 'fs';


export function SettingCommand(program: Command): void {
  program
    .command('setting:make <name> [module]')
    .description('Create a new setting file')
    .action(async (name: string, module: string='main') => {
      const content = fs.readFileSync(`${__dirname}/../../storage/stubs/setting.stub`);

      stub(`app/${module.toLowerCase()}/settings/${name.toLowerCase()}.ts`, content.toString());

      console.log(`🆗 Setting file '${name.toLowerCase()}' created successfully in module '${module.toLowerCase()}'.\n`);

      console.log('1️⃣  Your setting file is ready! You can now import it like this:' +
        `\n👉 import { setting } from '../settings/${name.toLowerCase()}'` +
        '\n\n2️⃣  Use the setting like so:' +
        '\n👉 const enable:boolean = setting.enable' +
        '\n\nEnjoy coding! 😎');

      process.exit();
    });
}
