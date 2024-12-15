import { Command } from '../commander';
import { stub } from '../stub';
import * as fs from 'fs';

export function JobCommand(program: Command): void {
  program
    .command('job:make <name> [module]')
    .description('Create a new job')
    .action(async (name: string, module: string = 'main') => {
      const content = fs.readFileSync(
        `${__dirname}/../../../storage/stubs/job.stub`
      );

      stub(
        `app/${module.toLowerCase()}/jobs/${name}.ts`,
        content.toString(),
        [
          {
            var: 'ClassName',
            value: name.charAt(0).toUpperCase() + name.slice(1),
          },
        ]
      );

      console.log(
        `🆗 Job ${name.charAt(0).toUpperCase() + name.slice(1)} created successfully in module ${module.toLowerCase()}.`
      );

      console.log(
        '\n1️⃣  Your job file is ready! You can now import it like this:' +
          `\n👉 import { ${
            name.charAt(0).toUpperCase() + name.slice(1)
          }Job } from "../jobs/${name}"` +
          '\n\n2️⃣  Use the job like so:' +
          `\n👉 new ${name.charAt(0).toUpperCase() + name.slice(1)}Job()` +
          '\n\n3️⃣  You can pass the data like this:' +
          `\n👉 new ${name.charAt(0).toUpperCase() + name.slice(1)}Job({id:1, name:'Hassan'})` +
          '\n\n4️⃣  You can access the data in job class like this:' +
          '\n👉 this.data' +
          '\n\nEnjoy coding! 😎'
      );
    });
}
