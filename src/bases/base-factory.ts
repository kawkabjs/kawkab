export abstract class BaseFactory {
  constructor(count: number = 1) {
    this.make(count);
  }

  private async make(count: number = 1) {
    for (let i = 0; i < count; i++) {
      await this.handle();
    }
  }

  async handle() {}
}