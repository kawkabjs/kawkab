import { Command } from '../commander';
import { stub } from '../stub';
import * as fs from 'fs';

export function CronJobCommand(program: Command): void {
  program
    .command('cron:make <name> [module]')
    .description('Create a new cron job')
    .action(async (name: string, module: string = 'main') => {
      const content = fs.readFileSync(
        `${__dirname}/../../../storage/stubs/cron-job.stub`
      );

      stub(
        `app/${module.toLowerCase()}/cron/${name}.ts`,
        content.toString(),
        [
          {
            var: 'ClassName',
            value: name.replace(/^\w/, (c) => c.toUpperCase()),
          },
        ]
      );

      console.log(
        `🆗 Cron job ${name} created successfully in module ${module.toLowerCase()}.`
      );

      process.exit();
    });
}
