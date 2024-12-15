import { Command } from '../commander';
import { stub } from '../stub';
import * as fs from 'fs';

export function CacheCommand(program: Command): void {
  program
    .command('cache:make <name> [module]')
    .description('Create a new cache class')
    .action(async (name: string, module: string = 'main') => {
      const content = fs.readFileSync(`${__dirname}/../../../storage/stubs/cache.stub`);

      stub(`app/${module.toLowerCase()}/cache/${name.toLowerCase()}.ts`, content.toString(), [
        { var: 'ClassName', value: `${name.charAt(0).toUpperCase() + name.slice(1)}`, },
        { var: 'ItemName', value: `${name.toLowerCase()}`, },
      ]);

      console.log(`🆗 Cache ${name.toLowerCase()} created successfully in module ${module.toLowerCase()}.`);

      console.log('\n1️⃣  Your cache class is ready! You can now import it like this:' +
        `\n👉 import { ${name.charAt(0).toUpperCase() + name.slice(1)}Cache } from "../cache/${name}"` +
        '\n\n2️⃣  Use the cache class like so:' +
        `\n👉 ${name.charAt(0).toUpperCase() + name.slice(1)}Cache.cache()` +
        '\n\n3️⃣  You can pass the data like this:' +
        `\n👉 ${name.charAt(0).toUpperCase() + name.slice(1)}Cache.cache({id:1, name:'Hassan'})` +
        '\n\n4️⃣  You can access the data in cache class like this:' +
        '\n👉 this.data' +
        '\n\nEnjoy coding! 😎');

      process.exit();
    });
}