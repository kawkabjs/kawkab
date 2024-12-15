import { Command } from '../commander';
import { stub } from '../stub';
import * as fs from 'fs';

export function FactoryCommand(program: Command): void {
  program
    .command('factory:make <name> [module]')
    .description('Create a new Factory class')
    .action(async (name: string, module: string = 'main') => {
      const content = fs.readFileSync(`${__dirname}/../../../storage/stubs/factory.stub`);

      stub(`app/${module.toLowerCase()}/factories/${name.toLowerCase()}.ts`, content.toString(), [
        { var: 'ClassName', value: name.replace(/^\w/, c => c.toUpperCase()) }
      ]);

      console.log(`🏭 Factory ${name.toLowerCase()} created successfully in module ${module.toLowerCase()}.`);

      console.log('\n1️⃣  Your Factory class is ready! You can now use it like this:' +
        `\n 👉 import { ${name.charAt(0).toUpperCase() + name.slice(1)}Factory } from '../factories/${name.toLowerCase()}'` +
        '\n\n You can create multiple records like this:' +
        `\n👉 new ${name.charAt(0).toUpperCase() + name.slice(1)}Factory(5) // Creates 5 records` +
        '\n\n2️⃣  Or create a single record:' +
        `\n👉 new ${name.charAt(0).toUpperCase() + name.slice(1)}Factory() // Creates 1 record` +
        '\n\n3️⃣  Don\'t forget to customize your factory data in the handle method:' +
        '\n    async handle() {' +
        '\n        const data = {' +
        '\n            name: faker.person.firstName(),' +
        '\n            email: faker.internet.email(),' +
        '\n            // Add more fields...' +
        '\n        };' +
        '\n    }' +
        '\n\nHappy Testing! 🚀');

      process.exit();
    });
}
