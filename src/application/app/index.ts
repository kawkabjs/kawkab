export class App {
  private configuration: any = {};

  private setConfig(data:object): object {
    return this.configuration = data;
  }

  public init(config:object) {
    this.setConfig(config);
        
    return this;
  }

  public isDevelopmentMode(): boolean {
    return process.env.NODE_ENV?.trim() === 'development';
  }

  public isProductionMode(): boolean {
    return process.env.NODE_ENV?.trim() === 'production';
  }

  public isCliMode(): boolean {
    return process.env.NODE_ENV?.trim() === 'cli';
  }

  public mode(): string {
    return process.env.NODE_ENV?.trim() || 'development';
  }

  public config() {
    return this.configuration;
  }
}