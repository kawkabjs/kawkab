import { Command } from '../commander';
import * as fs from 'fs';
import * as path from 'path';

export function EnvCommand(program: Command): void {
  program
    .command('env')
    .description('Create .env.development and .env.production from .env.example if not exists')
    .action(() => {
      const rootDir = process.cwd();

      const envExamplePath = path.join(rootDir, '.env.example');
      const envDevelopmentPath = path.join(rootDir, '.env.development');
      const envProductionPath = path.join(rootDir, '.env.production');

      if (!fs.existsSync(envExamplePath)) {
        console.log('❌ .env.example not found!');
        return;
      }

      if (!fs.existsSync(envDevelopmentPath)) {
        fs.copyFileSync(envExamplePath, envDevelopmentPath);
        console.log('✅ .env.development created from .env.example');
      } else {
        console.log('⚠️ .env.development already exists');
      }

      if (!fs.existsSync(envProductionPath)) {
        fs.copyFileSync(envExamplePath, envProductionPath);
        console.log('✅ .env.production created from .env.example');
      } else {
        console.log('⚠️ .env.production already exists');
      }

      process.exit();
    });
}
