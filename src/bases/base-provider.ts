import path from "path";
import fs from "fs";
import { RoutesGenerator } from "../shared/routes-generator";

export class BaseProvider {
  protected currentDir: string = __dirname;
  protected controllersDirs: string[] = [];

  constructor() {
    this.register();
  }

  register() {}

  boot() {}

  private getFirstLevelFolders(directoryPath: string): string[] {
    try {
      const items = fs.readdirSync(directoryPath, { withFileTypes: true });
      const folders = items
        .filter((item) => item.isDirectory())
        .map((folder) => folder.name);
      return folders;
    } catch (error) {
      return [];
    }
  }

  async modules(currentDir: string, dirName: string = ""): Promise<void> {
    // Search for .ts, .js, or .mjs module files in the specified path
    let moduleFileName: string;

    if (
      process.env.NODE_ENV === "development" ||
      process.env.NODE_ENV === "cli"
    ) {
      moduleFileName = "module.ts";
    } else {
      moduleFileName = "module.js";
    }

    const base = path.join(currentDir, dirName);

    const modules = this.getFirstLevelFolders(base);

    // Check if no files were found
    if (modules.length) {
      // Loop through all found module files
      modules.forEach((modulePath) => {
        const controllerPath = path.join(base, modulePath, "controllers");

        // Resolve the absolute path of the module
        const resolvedPath = path.join(base, modulePath, moduleFileName);

        // Get the relative path based on the current directory
        // const relativePath = path.join(dirName, modulePath, moduleFileName);

        // Check if the file exists
        if (fs.existsSync(resolvedPath)) {
          try {
            // Dynamically import the module
            let module = require(resolvedPath);

            module = module.default || module.Module;
            module = new module();

            // Check if the module is enabled
            if (module.isEnabled()) {
              this.controllersDirs.push(controllerPath);

              // Log the relative path and module name if enabled
              if (process.env.NODE_ENV != "cli") {
                // console.log(
                //   `✅ Loaded module: ${module.name()} (${relativePath})`
                // );
              }
            } else {
              // Log a message if the module is not enabled
              if (process.env.NODE_ENV != "cli") {
                // console.warn(
                //   `⚠️ Module ${module.name()} at (${relativePath}) is not enabled.`
                // );
              }
            }
          } catch (error) {
            // Handle any errors during module loading
            // console.error(
            //   `❌ Failed to load module at ${resolvedPath}:`,
            //   error
            // );
          }
        } else {
          // Warn if the file does not exist
          // console.warn(`⚠️ Skipped missing file: ${relativePath}`);
        }
      });
    }

    try {
      if (process.env.NODE_ENV === "production") {
        const routesPath = path.join(process.cwd(), ".dist/routes.json");

        if (!fs.existsSync(routesPath)) {
          await new RoutesGenerator(this.controllersDirs).generateRoutesJson();
          process.exit(0);
        }
        console.log("✅ Successfully loaded routes");
      }
    } catch (error) {}
  }
}
