import { Command } from '../commander';
import { stub } from '../stub';
import * as fs from 'fs';

export function EventCommand(program: Command): void {
  program
    .command('event:make <name> <event> [module]')
    .description('Create a new event')
    .action(async (name: string, event: string, module: string = 'main') => {
      const content = fs.readFileSync(
        `${__dirname}/../../../storage/stubs/event.stub`
      );

      stub(
        `app/${module.toLowerCase()}/events/${event}/${name}.ts`,
        content.toString(),
        [
          {
            var: 'ClassName',
            value: name.replace(/^\w/, (c) => c.toUpperCase()),
          },
        ]
      );

      console.log(
        `🆗 Event ${name} created successfully in module ${module.toLowerCase()}.`
      );

      
      console.log(
        '\n1️⃣  Your event file is ready! You can now emit it like this:' +
          '\n👉 import { event } from "kawkab"' +
          `\n👉 event.emit('${event.toLowerCase()}')` +
          '\n\n2️⃣  You can pass the data like this:' +
          `\n👉 event.emit('${event.toLowerCase()}', { key: 'value' })` +
          '\n\nEnjoy coding! 😎'
      );
    });
}
