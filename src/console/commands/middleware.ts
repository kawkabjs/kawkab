import { Command } from '../commander';
import { stub } from '../stub';
import * as fs from 'fs';

export function MiddlewareCommand(program: Command): void {
  program
    .command('middleware:make <name> [module]')
    .description('Create a new middleware')
    .action(async (name: string, module: string = 'main') => {
      const content = fs.readFileSync(
        `${__dirname}/../../../storage/stubs/middleware.stub`
      );

      stub(
        `app/${module.toLowerCase()}/middleware/${name.toLowerCase()}.ts`,
        content.toString(),
        [{ var: 'ClassName', value: name.charAt(0).toUpperCase() + name.slice(1) }]
      );

      console.log(
        `🆗 Middleware ${name.toLowerCase()} created successfully in module ${module.toLowerCase()}.`
      );

      console.log(
        '\n1️⃣  Your middleware file is ready! You can now import it like this:' +
          `\n👉 import { ${
            name.charAt(0).toUpperCase() + name.slice(1)
          }Middleware } from "../middleware/${name}"` +
          '\n\n2️⃣  Use the middleware like so:' +
          `\n👉 new ${name.charAt(0).toUpperCase() + name.slice(1)}Middleware()` +
          '\n\n3️⃣  You can pass the data like this:' +
          `\n👉 new ${name.charAt(0).toUpperCase() + name.slice(1)}Middleware({id:1, name:'Hassan'})` +
          '\n\n4️⃣  You can access the data in middleware class like this:' +
          '\n👉 this.data' +
          '\n\nEnjoy coding! 😎'
      );

      process.exit();
    });
}
