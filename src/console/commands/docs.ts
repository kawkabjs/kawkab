
import { Command } from '../commander';
import apidoc from 'apidoc';
import path from 'path';
import fs from 'fs';
import { app } from '../..';

export function DocsCommand(program: Command): void {
  program
    .command('docs:make')
    .description('Generate API documentation')
    .action(async () => {
      // Configuration
      const config = app.config();
      // Define the input directory for source files (JROOT of the project)
      const inputDir = path.resolve(process.cwd(), './'); // Source files path in the root of the project
      // Define the output directory for generated documentation
      const outputDir = path.resolve(process.cwd(), './' + config.docs.path); // Output documentation folder path in the root
      // Path for the temporary apidoc.json file
      const apidocConfigPath = path.resolve(process.cwd(), './apidoc.json');
      // Create the apidoc.json file
      const apidocConfigContent = {
        name: config.docs.title,
        version: '1.0.0',
        description: config.docs.description,
        sampleUrl: config.server.url.replace(/[/\\]+$/, '') +  (config.server.port ? ':' + config.server.port : '') + '/' + config.route.prefix.replace(/^\/|\/$/g, ''),
        defaultVersion: '1.0.0',
        template: {
          forceLanguage: 'en',
        },
      };

      try {
        fs.writeFileSync(apidocConfigPath, JSON.stringify(apidocConfigContent, null, 2));

        // Call apidoc to generate the documentation
        const result = apidoc.createDoc({
          src: inputDir,    // Source files path
          dest: outputDir,  // Documentation output files path
          excludeFilters: ['node_modules', 'public'], // Exclude specific directories
          silent: true,   // Suppress console output
        });

        // Check if the documentation generation was successful
        if (result === false) {
          console.error('❌ Error: Documentation generation failed! Please check the input files and try again.');
          process.exit(1);
        } else {
          console.log(`🆗 API documentation generated successfully at: '${outputDir}'.\n`);
          console.log('1️⃣ Your API documentation is ready! You can now access it like this:');
          console.log(`👉 Open '${outputDir}/index.html' in your browser to view the generated docs.`);
          console.log('\nEnjoy coding! 😎');
        }
      } catch (error) {
        console.error('❌ Error occurred during documentation generation:', error);
        process.exit(1);
      } finally {
        // Remove the temporary apidoc.json file
        if (fs.existsSync(apidocConfigPath)) {
          fs.unlinkSync(apidocConfigPath);
        }
      }

      process.exit();
    });
}
