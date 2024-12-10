// Import the main framework object from the 'kawkab' package
import { kawkab } from 'kawkab';

// Import the application configuration object from the specified path
import { app as config } from './app/configuration';

// Initialize the application using the 'kawkab' framework and the provided configuration
export const app = kawkab.init(config);
