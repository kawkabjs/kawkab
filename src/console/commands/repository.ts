import { Command } from '../commander';
import { stub } from '../stub';
import * as fs from 'fs';

export function RepositoryCommand(program: Command): void {
  program
    .command('repository:make <name> [module]')
    .description('Create a new repository')
    .action(async (name: string, module: string = 'main') => {
      const content = fs.readFileSync(`${__dirname}/../../storage/stubs/repository.stub`);

      stub(`app/${module.toLowerCase()}/repositories/${name.toLowerCase()}.ts`, content.toString(), [
        { var: 'ClassName', value: name.replace(/^\w/, c => c.toUpperCase()) }
      ]);

      console.log(`🆗 Repository ${name.toLowerCase()} created successfully in module ${module.toLowerCase()}.`);

      console.log('\n1️⃣  Your repository file is ready! You can now inject it into a service like this:' +
        `\n👉 constructor(private ${name.toLowerCase()}Repository = ${name.charAt(0).toUpperCase() + name.slice(1)}Repository.inject()){ super() }` +
        '\n\n2️⃣  Use the repository like so in the service class:' +
        `\n👉 this.${name.toLowerCase()}Repository.someMethod()` +
        '\n\nEnjoy coding! 😎');

      process.exit();
    });
}
