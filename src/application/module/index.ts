import { commander, config, db, event, trans } from '../..';
import * as path from 'path';

export interface IModule {
  name: string;
  instance: object;
  path: string;
  controllers?: string;
  config?: string;
  trans?: string;
  events?: string;
  database_migration?: string;
  database_seeds?: string;
  commands?: string;
}

export class Module {
  static modules: IModule[] = [];

  static has(name: string): boolean {
    return this.modules.some((module) => module.name === name);
  }

  static get(name: string): IModule | undefined {
    return this.modules.find((module) => module.name === name);
  }

  static remove(name: string): void {
    this.modules = this.modules.filter((module) => module.name !== name);
  }

  static getAll(): IModule[] {
    return this.modules;
  }

  static set(module: IModule): void {
    module.instance = module.instance;
    module.controllers = module.controllers ?? 'controllers';
    module.config = module.config ?? 'config';
    module.trans = module.trans ?? 'trans';
    module.events = module.events ?? 'events';
    module.commands = module.commands ?? 'commands';
    module.database_migration = path.join(
      module.path,
      module.database_migration ?? 'migrations'
    );
    module.database_seeds = path.join(
      module.path,
      module.database_seeds ?? 'seeds'
    );

    if (!this.has(module.name)) {
      this.modules.push(module);
    }

    this.integrate(module);
  }

  static integrate(module: any) {
    config.load(['./app/' + module.name + '/' + module.config]);
    trans.load(['./app/' + module.name + '/' + module.trans]);
    event.load([path.join(module.path, module.events)]);
    commander.load([path.join(module.path, module.commands)]);
    db.load([module.database_migration], [module.database_seeds]);
  }

  static router() {}
}
