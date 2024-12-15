import { Command } from '../commander';
import { stub } from '../stub';
import * as fs from 'fs';

export function ConfigCommand(program: Command): void {
  program
    .command('config:make name [type] [module]')
    .description('Create a new config file')
    .action(
      async (name: string, type: string = 'json', module: string = 'main') => {
        const stubPath =
          type === 'json'
            ? `${__dirname}/../../../storage/stubs/config-json.stub`
            : `${__dirname}/../../../storage/stubs/config-ts.stub`;

        let content: string = fs.readFileSync(stubPath, 'utf-8');

        const content_type = type === 'json' ? 'json' : 'ts';

        const targetPath = `app/${module.toLowerCase()}/config/${name.toLowerCase()}.${content_type}`;
        stub(targetPath, content);

        console.log(
          `🆗 Config file '${name.toLowerCase()}' created successfully in module '${module.toLowerCase()}'.\n`
        );

        console.log(
          '1️⃣  Your config file is ready! You can now import it like this:' +
            '\n👉 import { config } from \'kawkab\'' +
            '\n\n2️⃣  Use the config like so:' +
            '\n👉 config.get(\'config.enable\')' +
            '\n\nEnjoy coding! 😎'
        );

        process.exit();
      }
    );
}
