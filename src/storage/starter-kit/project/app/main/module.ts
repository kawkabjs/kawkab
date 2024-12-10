import { BaseModule } from 'kawkab';

export class Module extends BaseModule {
  /**
     * This method is used to set the name of the module.
     * It returns the name of the module.
     * 
     * @returns {string} The name of the module.
     */
  name(): string {
    return 'main';
  }

  /**
     * This method checks if the module is enabled or not.
     * 
     * @returns {boolean} Returns `true` if the module is enabled, otherwise `false`.
     */
  isEnabled(): boolean {
    return true;
  }

  /**
     * This method is called once when the server starts and the application launches.
     * It registers and initializes the necessary modules for the application.
     * This method runs only once during the application's lifecycle.
     */
  register() {
    this.module(this, __dirname);
  }

  /**
     * This method is called with every incoming request.
     * It is used to initialize any additional configurations or services
     * that need to be set up for each request.
     */
  boot() {
    // Add code here
  }
}
