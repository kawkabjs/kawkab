import { Command } from '../commander';
import { stub } from '../stub';
import * as fs from 'fs';

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function ResourceCommand(program: Command): void {
  program
    .command('resource:make <name> [module]')
    .description('Create a new resources')
    .action(async (name: string, module: string = 'main') => {
      const content = fs.readFileSync(`${__dirname}/../../../storage/stubs/resource.stub`);

      stub(`app/${module.toLowerCase()}/resources/${name.toLowerCase()}.ts`, content.toString(), [
        {var: 'ClassName', value: capitalizeFirstLetter(name)}
      ]);

      console.log(`🆗 Resource ${name} created successfully in module ${module.toLowerCase()}.`);

      console.log('1️⃣  Your resource is ready! You can now import it like this:' +
        `\n\n👉 import { ${capitalizeFirstLetter(name)}Resource } from '../resources/${capitalizeFirstLetter(name).toLowerCase()}'` +
        '\n\n2️⃣  Use the resource like so:' +
        '\n👉 const users = await Users.query().get();' +
        `\n👉 return { status: true, users: ${capitalizeFirstLetter(name)}Resource.collect(users) };` +
        '\n\nEnjoy coding! 😎');

      process.exit();
    });
}
