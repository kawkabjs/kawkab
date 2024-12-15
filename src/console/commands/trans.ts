import { Command } from '../commander';
import { stub } from '../stub';
import * as fs from 'fs';
import * as path from 'path';

export function TransCommand(program: Command): void {
  program
    .command('trans:make <language> [type] [module]')
    .description('Create a new translation file')
    .action(async (language: string, type: string = 'ts', module: string = 'main') => {

      // Set content type based on the provided type, default to 'ts'
      const contentType = type === 'json' ? 'json' : 'ts';
      
      // Define the path to the appropriate stub file based on the type
      const stubPath = type === 'json'
        ? `${__dirname}/../../../storage/stubs/trans-json.stub`
        : `${__dirname}/../../../storage/stubs/trans-ts.stub`;

      // Read the content of the stub file
      let content: string = fs.readFileSync(stubPath, 'utf-8');

      // Define the target path where the new translation file will be created
      const targetPath = path.join(`app/${module.toLowerCase()}/trans`, `${language.toLowerCase()}.${contentType}`);

      // Check if the translation file already exists
      if (fs.existsSync(targetPath)) {
        console.log(`⚠️ Translation file for '${language}' already exists in module '${module}'. No file created.`);
        return; // Exit if the file exists
      }

      // If the file does not exist, create it using the stub content
      stub(targetPath, content);

      console.log(`🆗 Config file '${language.toLowerCase()}' created successfully in module '${module.toLowerCase()}'.\n`);

      // Provide usage instructions after file creation
      console.log('1️⃣  Your translation file is ready! You can now import it like this:' +
        '\n👉 import { trans, t, __ } from \'kawkab\'' +
        '\n\n2️⃣  Use the translation like so:' +
        '\n👉 trans.get(\'hello\')' +
        '\n\n3️⃣  Or use the translation like so:' +
        '\n👉 t(\'key\')' +
        '\n\n4️⃣  Or use the translation like so:' +
        '\n👉 __(\'key\')' +
        '\n\nEnjoy coding! 😎');

      process.exit();
    });
}
