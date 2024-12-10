import { Command } from '../commander';
import { stub } from '../stub';
import * as fs from 'fs';

export function ServiceCommand(program: Command): void {
  program
    .command('service:make <name> [module]')
    .description('Create a new service')
    .action(async (name: string, module: string = 'main') => {
      const content = fs.readFileSync(`${__dirname}/../../storage/stubs/service.stub`);

      stub(`app/${module.toLowerCase()}/services/${name.toLowerCase()}.ts`, content.toString(), [
        { var: 'ClassName', value: name.replace(/^\w/, c => c.toUpperCase()) }
      ]);

      console.log(`🆗 Service ${name.toLowerCase()} created successfully in module ${module.toLowerCase()}.`);

      console.log('\n1️⃣  Your service file is ready! You can now inject it into a controller like this:' +
        `\n👉 constructor(private ${name.toLowerCase()}Service = ${name.charAt(0).toUpperCase() + name.slice(1)}Service.inject()){ super() }` +
        '\n\n2️⃣  Use the service like so in the controller class:' +
        `\n👉 this.${name.toLowerCase()}Service.someMethod()` +
        '\n\nEnjoy coding! 😎');

      process.exit();
    });
}
