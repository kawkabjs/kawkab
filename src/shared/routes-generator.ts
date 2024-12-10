import fg from 'fast-glob';
import { readFileSync, writeFileSync } from 'fs';

export class RoutesGenerator {
  private patterns: string[];
  private jsonFilePath: string; // JSON file path
  private routesData: { controller: string; path: string; method: string[] }[];

  constructor(patterns: string[]) {
    this.patterns = patterns;
    this.jsonFilePath = './.dist/routes.json'; // Set JSON file path to root directory
    this.routesData = [];
  }

  // Extract HTTP methods from the content of a file
  private extractMethods(content: string): string[] {
    const methods: string[] = [];
    const methodNames = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head'];

    methodNames.forEach((method) => {
      const methodPattern = new RegExp(`\\b${method}\\b\\s*\\(`, 'i');
      if (methodPattern.test(content)) {
        methods.push(method.toUpperCase());
      }
    });

    return [...new Set(methods)]; // Remove duplicates
  }

  // Normalize route path for duplicate checking
  private normalizePath(path: string): string {
    // Replace all dynamic segments with a standard placeholder
    return path.replace(/:[^/]+/g, ':dynamic');
  }

  // Recursively get all 'index.js' files from the directories
  private async getAllIndexFiles(): Promise<string[]> {
    const files = await Promise.all(
      this.patterns.map((pattern) => fg(`${pattern.replace(/\\/g, '/')}/**/index.js`))
    );
    return files.flat();
  }

  // Sort routes: static routes first, then by specificity, and catch-all routes last
  private sortRoutes(): void {
    this.routesData.sort((a, b) => {
      // Check if the routes are static
      const isAStatic = !a.path.includes(':') && !a.path.includes('*');
      const isBStatic = !b.path.includes(':') && !b.path.includes('*');

      if (isAStatic && !isBStatic) return -1;
      if (!isAStatic && isBStatic) return 1;

      // Handle dynamic and catch-all routes
      const aDynamicSegments = (a.path.match(/[:\*]/g) || []).length;
      const bDynamicSegments = (b.path.match(/[:\*]/g) || []).length;

      if (aDynamicSegments !== bDynamicSegments) {
        return aDynamicSegments - bDynamicSegments;
      }

      return a.path.localeCompare(b.path);
    });
  }

  // Generate JSON file with routes data
  public async generateRoutesJson(): Promise<void> {
    try {
      const indexFiles = await this.getAllIndexFiles();

      indexFiles.forEach((controllerPath) => {
        try {
          const content = readFileSync(controllerPath, 'utf-8');
          const relativePath = controllerPath
            .replace(/\\/g, '/')
            // .replace(/\/index\.js$/, '')
            // .replace(/\.js$/, '');

          const methods = this.extractMethods(content);

          let relativeRoutePath = '/' + relativePath.split('/controllers/').pop();
          relativeRoutePath = relativeRoutePath.replace(/\\/g, '/').replace(/\/index\.js$/, '').replace(/\.js$/, '');

          // Normalize path to check for duplicates
          const normalizedPath = this.normalizePath(relativeRoutePath);

          const isDuplicate = this.routesData.some(
            (route) =>
              this.normalizePath(route.path) === normalizedPath &&
              JSON.stringify(route.method.sort()) === JSON.stringify(methods.sort())
          );

          if (!isDuplicate) {
            this.routesData.push({
              path: relativeRoutePath,
              controller: relativePath,
              method: methods,
            });
          }
        } catch (error: any) {
          console.error(`Error reading content of controller file ${controllerPath}: ${error.message}`);
        }
      });

      // Sort routes
      this.sortRoutes();
    } catch (error: any) {
      console.error(`Error reading patterns: ${error.message}`);
    }

    try {
      writeFileSync(this.jsonFilePath, JSON.stringify(this.routesData, null, 2), 'utf-8');
      console.log(`Routes JSON file has been generated at ${this.jsonFilePath}.`);
    } catch (error: any) {
      console.error(`Error writing JSON routes file: ${error.message}`);
    }
  }
}
