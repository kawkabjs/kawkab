import { Command } from '../commander';
import { stub } from '../stub';
import * as fs from 'fs';

export function ActionCommand(program: Command): void {
  program
    .command('action:make <name> [module]')
    .description('Create a new action')
    .action(async (name: string, module: string = 'main') => {
      const content = fs.readFileSync(`${__dirname}/../../storage/stubs/action.stub`);

      stub(`app/${module.toLowerCase()}/actions/${name.toLowerCase()}.ts`, content.toString(), [
        { var: 'ClassName', value: name.replace(/^\w/, c => c.toUpperCase()) }
      ]);

      console.log(`🆗 Action ${name.toLowerCase()} created successfully in module ${module.toLowerCase()}.`);

      console.log('\n1️⃣  Your action file is ready! You can now import it like this:' +
        `\n👉 import { ${name.charAt(0).toUpperCase() + name.slice(1)}Action } from "../actions/${name}"` +
        '\n\n2️⃣  Use the action like so:' +
        `\n👉 new ${name}Action()` +
        '\n\n3️⃣  You can pass the data like this:' +
        `\n👉 new ${name}Action({id:1, name:'Hassan'})` +
        '\n\n4️⃣  You can access the data in action class like this:' +
        '\n👉 this.data' +
        '\n\nEnjoy coding! 😎');
        
      process.exit();
    });
}