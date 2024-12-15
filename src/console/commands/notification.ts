import { Command } from '../commander';
import { stub } from '../stub';
import * as fs from 'fs';

export function NotificationCommand(program: Command): void {
  program
    .command('notification:make <name> [module]')
    .description('Create a new notification')
    .action(async (name: string, module: string = 'main') => {
      const content = fs.readFileSync(
        `${__dirname}/../../../storage/stubs/notification.stub`
      );

      stub(
        `app/${module.toLowerCase()}/notifications/${name}.ts`,
        content.toString(),
        [
          {
            var: 'ClassName',
            value: name.replace(/^\w/, (c) => c.toUpperCase()),
          },
        ]
      );

      console.log(
        `🆗 Notification ${name} created successfully in module ${module.toLowerCase()}.`
      );

      console.log(
        '\n1️⃣  Your notification file is ready! You can now emit it like this:' +
          `\n👉 import { ${name.charAt(0).toUpperCase() + name.slice(1)}Notification } from "../notifications/${name}"` +
          `\n👉 await new ${name.charAt(0).toUpperCase() + name.slice(1)}Notification().send()` +
          '\n\n2️⃣  You can pass the data like this:' +
          `\n👉 await ${name.charAt(0).toUpperCase() + name.slice(1)}Notification().send({id:1, name:'Hassan'})` +
          '\n\n3️⃣  You can access the data in notification class like this:' +
          '\n👉 this.data' +
          '\n\nEnjoy coding! 😎'
      );

      process.exit();
    });
}
