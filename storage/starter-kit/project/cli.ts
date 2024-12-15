/**
 * Main CLI application entry point
 * This file sets up and configures the command-line interface for the application
 */
import { kawkab, command, commander } from 'kawkab';
import { app as config } from './app/configuration';

/**
 * Initialize and run the CLI application
 * Handles command registration, processing, and execution
 */
async function main() {
  try {
    // Initialize the application with configuration
    await kawkab.init(config);

    // Create a new command program instance
    const program = new command();

    // Initialize commands array to store all available commands
    const commands: Array<any> = [];

    // Load and register all commands from modules
    const loadedCommands = await commander.getCommands();
    commands.push(...loadedCommands);

    // Process all commands (both loaded and built-in)
    commands
      .concat(commander.builtInCommands())
      .forEach(cmd => cmd(program, null));

    // Start processing command line arguments
    program.parse(process.argv);
  } catch (error) {
    console.error('Failed to initialize CLI:', error);
    process.exit(1);
  }
}

// Error handling
main().catch(error => {
  console.error('Fatal error running the application:', error);
  process.exit(1);
});
