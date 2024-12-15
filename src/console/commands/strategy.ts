import { Command } from '../commander';
import { stub } from '../stub';
import * as fs from 'fs';

/**
 * Registers the strategy:make command to create a new strategy pattern implementation
 * 
 * This command creates three files:
 * 1. An interface file (IStrategy.ts)
 * 2. A main strategy implementation file (NameStrategy.ts)
 * 3. A concrete strategy implementation file (StrategyA.ts)
 * 
 * @param program - The command instance to register this command to
 * @example
 * // Create a strategy named 'Login' in the 'main' module
 * strategy:make Login main
 * 
 * // Create a strategy named 'Auth' in the default 'main' module
 * strategy:make Auth
 */
export function StrategyCommand(program: Command): void {
  program
    .command('strategy:make <name> [module]')
    .description('Create a new strategy pattern implementation with interface and concrete classes')
    .action(async (name: string, module: string = 'main') => {
      const content = fs.readFileSync(`${__dirname}/../../../storage/stubs/strategy.stub`);
      const strategyAContent = fs.readFileSync(`${__dirname}/../../../storage/stubs/strategy-a.stub`);
      const interfaceContent = fs.readFileSync(`${__dirname}/../../../storage/stubs/strategy-interface.stub`);

      // Create the strategy interface file
      stub(`app/${module.toLowerCase()}/strategies/${name.toLowerCase()}/IStrategy.ts`, interfaceContent.toString());

      // Create the strategy implementation file
      const strategyContent = content.toString().replace('<ClassName>', name.charAt(0).toUpperCase() + name.slice(1));
      stub(`app/${module.toLowerCase()}/strategies/${name.toLowerCase()}/${name.charAt(0).toUpperCase() + name.slice(1)}Strategy.ts`, strategyContent);

      // Create the strategy A implementation file
      stub(`app/${module.toLowerCase()}/strategies/${name.toLowerCase()}/StrategyA.ts`, strategyAContent.toString());

      console.log(`🆗 Strategy '${name.charAt(0).toUpperCase() + name.slice(1)}' created successfully in module '${module.toLowerCase()}'.\n`);
      
      console.log('1️⃣  Your strategy files are ready! You can now import them like this:' +
        `\n👉 import { ${name.charAt(0).toUpperCase() + name.slice(1)}Strategy } from '../strategies/${name.toLowerCase()}/${name.charAt(0).toUpperCase() + name.slice(1)}Strategy'` +
        '\n\n2️⃣  Use the strategy like so:' +
        `\n👉 const strategy = ${name.charAt(0).toUpperCase() + name.slice(1)}Strategy.StrategyA().execute()` +
        '\n\nEnjoy coding! 😎');

      process.exit();
    });
}