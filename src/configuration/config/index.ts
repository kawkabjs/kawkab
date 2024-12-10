import fs from 'fs';
import path from 'path';

export class Config {
  private config: Record<string, any> = {};

  constructor(configDirs: string[] = []) {
    this.loadConfigs(configDirs);
  }

  private loadConfigs(dirs: string[], module_name: string = '') {
    dirs.forEach(dir => {
      if (fs.existsSync(dir) && fs.lstatSync(dir).isDirectory()) {
        const files = fs.readdirSync(dir);

        files.forEach(file => {
          const filePath = path.join(dir, file);
          if (this.isConfigFile(filePath)) {
            const configKey = path.basename(file, path.extname(file));
            const key_name = module_name ? module_name + ':' + configKey : configKey;
            this.config[key_name] = this.readConfigFile(filePath);
          }
        });
      }
    });
  }

  private isConfigFile(filePath: string): boolean {
    const ext = path.extname(filePath);
    return ext === '.json' || ext === '.js' || ext === '.ts';
  }

  private readConfigFile(filePath: string): any {
    try {
      const ext = path.extname(filePath);
      if (ext === '.json') {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileContent);
      } else if (ext === '.js' || ext === '.ts') {
        const resolvedPath = path.resolve(filePath);
        const configModule = require(resolvedPath);
        return configModule.default || configModule;
      } else {
        throw new Error(`Unsupported config file type: ${ext}`);
      }
    } catch (error) {
      console.error(`Error reading config file: ${filePath}`, error);
      return {};
    }
  }

  public load(configDirs: string[] = [], module_name: string = '') {
    this.loadConfigs(configDirs, module_name);
  }

  private replace(message: string, replacements: Record<string, string>): string {
    return message.replace(/:(\w+)/g, (match, key) => {
      return replacements.hasOwnProperty(key) ? replacements[key] : match;
    });
  }

  public all() {
    return this.config;
  }

  public get(key: string, replacements: Record<string, string> = {}, fallback?: any): any {
    const keys = key.split('.');
    let result = this.config;
    
    for (const k of keys) {
      if (result && k in result) {
        result = result[k];
      } else {
        return fallback;
      }
    }
    
    if (typeof result === 'string' && Object.keys(replacements).length > 0) {
      return this.replace(result, replacements);
    }
    
    return result ?? fallback;
  }
}
