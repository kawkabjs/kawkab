import { Command } from 'commander';

// Import built-in commands
import { DocsCommand } from '../commands/docs';
import { SettingCommand } from '../commands/setting';
import { DataCommand } from '../commands/data';
import { ConfigCommand } from '../commands/config';
import { ControllerCommand } from '../commands/controller';
import { EnumCommand } from '../commands/enum';
import { EnvCommand } from '../commands/env';
import { EventCommand } from '../commands/event';
import { ActionCommand } from '../commands/action';
import { MiddlewareCommand } from '../commands/middleware';
import { RepositoryCommand } from '../commands/repository';
import { ServiceCommand } from '../commands/service';
import { TransCommand } from '../commands/trans';
import { DtoCommand } from '../commands/dto';
import { ValidationCommand } from '../commands/validation';
import { ModelCommand } from '../commands/model';
import { MigrationCommand } from '../commands/migration';
import { MigrateCommand } from '../commands/migrate';
import { MigrationRollbackCommand } from '../commands/migration-rollback';
import { SeederCommand } from '../commands/seeder';
import { SeedingCommand } from '../commands/seeding';
import { ResourceCommand } from '../commands/resource';
import { ModuleCommand } from '../commands/module';
import { CacheCommand } from '../commands/cache';
import { HttpCommand } from '../commands/http';
import { StrategyCommand } from '../commands/strategy';
import { TestIntegrationCommand } from '../commands/test-integration';
import { TestUnitCommand } from '../commands/test-unit';
import { NotificationCommand } from '../commands/notification';
import { CommandCommand } from '../commands/command';
import { MigrationFreshCommand } from '../commands/migration-fresh';
import { FactoryCommand } from '../commands/factory';
import { JobCommand } from '../commands/job';
import { CronJobCommand } from '../commands/cron-job';

class Commander {
  private dirs: string[] = [];
  command: object[] = [];

  public load(dirs: string[]) {
    this.dirs.push(...dirs);
  }

  public async getCommands(): Promise<Function[]> {
    const commands: Function[] = [];
    const commandPaths = new Set<string>();
    const commandNames = new Set<string>();
    const fs = require('fs');
    const path = require('path');

    // Helper function to safely add command
    const safeAddCommand = (cmd: Function) => {
      try {
        const tempProgram = new Command();
        cmd(tempProgram);
        
        // Get the command name from the temporary program
        const cmdName = tempProgram.commands[0]?.name();
        if (cmdName && !commandNames.has(cmdName)) {
          commands.push(cmd);
          commandNames.add(cmdName);
          return true;
        }
      } catch (error) {
        // If any error occurs during command registration, skip it
        return false;
      }
      return false;
    };

    for (const dir of this.dirs) {
      if (!fs.existsSync(dir)) {
        continue;
      }

      try {
        const files = fs.readdirSync(dir);
        
        for (const file of files) {
          if (!file.endsWith('.ts') && !file.endsWith('.js')) {
            continue;
          }

          try {
            const filePath = path.join(dir, file);
            const module = require(filePath);
            
            // Handle default exports
            if (typeof module.default === 'function') {
              const commandId = `${filePath}:default`;
              if (!commandPaths.has(commandId) && safeAddCommand(module.default)) {
                commandPaths.add(commandId);
              }
            }
            
            // Handle named exports
            for (const key in module) {
              if (key === 'default') continue; // Skip default export as it's already handled
              if (key.endsWith('Command') && typeof module[key] === 'function') {
                const commandId = `${filePath}:${key}`;
                
                if (!commandPaths.has(commandId) && safeAddCommand(module[key])) {
                  commandPaths.add(commandId);
                }
              }
            }
          } catch (fileError) {
            continue;
          }
        }
      } catch (dirError) {
        continue;
      }
    }

    return commands;
  }

  add(cmd: object) {
    this.command.push(cmd);
  }

  builtInCommands() {
    const builtInCmds = [
      ModuleCommand,
      DocsCommand,
      SettingCommand,
      DataCommand,
      ConfigCommand,
      ControllerCommand,
      EnumCommand,
      EventCommand,
      EnvCommand,
      ActionCommand,
      MiddlewareCommand,
      RepositoryCommand,
      ServiceCommand,
      TransCommand,
      DtoCommand,
      ValidationCommand,
      ModelCommand,
      MigrationCommand,
      MigrateCommand,
      MigrationRollbackCommand,
      MigrationFreshCommand,
      SeederCommand,
      SeedingCommand,
      ResourceCommand,
      CacheCommand,
      HttpCommand,
      StrategyCommand,
      TestIntegrationCommand,
      TestUnitCommand,
      NotificationCommand,
      CommandCommand,
      FactoryCommand,
      JobCommand,
      CronJobCommand,
    ];

    // Filter out commands that would be duplicates
    const tempProgram = new Command();
    const usedNames = new Set<string>();
    
    return builtInCmds.filter(cmd => {
      try {
        cmd(tempProgram);
        const cmdName = tempProgram.commands[tempProgram.commands.length - 1]?.name();
        if (cmdName && !usedNames.has(cmdName)) {
          usedNames.add(cmdName);
          return true;
        }
        return false;
      } catch (error) {
        return false;
      }
    });
  }
}

export { Commander, Command };
