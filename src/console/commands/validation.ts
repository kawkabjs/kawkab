import { Command } from '../commander';
import { stub } from '../stub';
import * as fs from 'fs';

export function ValidationCommand(program: Command): void {
  program
    .command('validation:make <name> [module]')
    .description('Create a new validation')
    .action(async (name: string, module: string = 'main') => {
      
      const content = fs.readFileSync(`${__dirname}/../../storage/stubs/validation.stub`);

      stub(`app/${module.toLowerCase()}/validation/${name.toLowerCase()}.ts`, content.toString(), [
        { var: 'ClassName', value: name.replace(/^\w/, c => c.toUpperCase()) }
      ]);

      console.log(`🆗 Validation ${name.toLowerCase()} created successfully in module ${module.toLowerCase()}.`);

      console.log('\n1️⃣  Your validation class is ready! You can now use it like this:' +
        `\n 👉 import { ${name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()}Validation } from '../validation/${name.toLowerCase()}'` +
        '\n\n Simply create an instance like this:' +
        `\n👉 new ${name.charAt(0).toUpperCase() + name.slice(1)}Validation()` +
        '\n\nEnjoy coding! 😎');
        
      process.exit();
    });
}
