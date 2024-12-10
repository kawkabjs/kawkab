import { Command } from '../commander';
import { stub } from '../stub';
import * as fs from 'fs';

export function HttpCommand(program: Command): void {
  program
    .command('http:make <name> [module]')
    .description('Create a new http request')
    .action(async (name: string, module: string = 'main') => {
      const content = fs.readFileSync(
        `${__dirname}/../../storage/stubs/http.stub`
      );

      stub(
        `app/${module.toLowerCase()}/http/${name}.ts`,
        content.toString(),
        [
          {
            var: 'ClassName',
            value: name.replace(/^\w/, (c) => c.toUpperCase()),
          },
        ]
      );

      console.log(
        `🆗 HTTP request ${name} created successfully in module ${module.toLowerCase()}.`
      );

      console.log(
        '\n1️⃣  Your HTTP request file is ready! You can now emit it like this:' +
          `\n👉 import { ${name.charAt(0).toUpperCase() + name.slice(1)}HttpRequest } from "../http/${name}"` +
          `\n👉 const response = await new ${name.charAt(0).toUpperCase() + name.slice(1)}HttpRequest().send()` +
          '\n\n2️⃣  You can pass the data like this:' +
          `\n👉 const response = await new ${name.charAt(0).toUpperCase() + name.slice(1)}HttpRequest().send({id:1, name:'Hassan'})` +
          '\n\n3️⃣  You can access the data in HTTP request class like this:' +
          '\n👉 this.data' +
          '\n\nEnjoy coding! 😎'
      );

      process.exit();
    });
}
