import { Module } from '../application/module';

export class BaseModule {
  constructor() {
    if(this.isEnabled()) {
      this.register();
    }
  }

  name(): string {
    return 'module';
  }

  isEnabled(): boolean {
    return true;
  }

  register() {}

  boot() {}

  async module(instance: object, path: string) {        
    await Module.set({
      name: this.name(),
      instance: instance,
      path: path,
    });
  }
}
