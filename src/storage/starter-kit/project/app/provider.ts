import { BaseProvider } from 'kawkab';

// Custom provider class that extends the base provider functionality
export class Provider extends BaseProvider {
  // Directory of the current provider class
  protected currentDir: string = __dirname;

  // Method to register modules or dependencies during the application setup
  async register(): Promise<void> {
    await this.modules(__dirname); // Register necessary modules
  }

  // Method to handle runtime initialization or configuration
  boot(): void {
    // Initialize or configure things needed at runtime
  }
}