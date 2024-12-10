import fs from 'fs';
import path from 'path';

export class Trans {
  private translations: Record<string, Record<string, string>> = {};
  private locale: string | null = null;
  private defaultLocale: string = 'en';

  constructor(translationsDirs: string[] = []) {
    this.loadTranslations(translationsDirs);
  }

  public all(locale?: string) {
    if(!locale){
      return this.translations;
    }

    return this.translations[locale] || {};
  }

  private replace(
    message: string,
    replacements: Record<string, string>
  ): string {
    return message.replace(/:(\w+)/g, (match, key) => {
      return replacements.hasOwnProperty(key) ? replacements[key] : match;
    });
  }

  private isTranslationFile(filePath: string): boolean {
    const ext = path.extname(filePath);
    return ext === '.json' || ext === '.js' || ext === '.ts';
  }

  private readTranslationFile(filePath: string): Record<string, string> {
    try {
      const ext = path.extname(filePath);
      if (ext === '.json') {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileContent);
      } else if (ext === '.js' || ext === '.ts') {
        const resolvedPath = path.resolve(filePath);
        const translationModule = require(resolvedPath);
        return translationModule.default || translationModule;
      } else {
        throw new Error(`Unsupported translation file type: ${ext}`);
      }
    } catch (error) {
      console.error(`Error reading translation file: ${filePath}`, error);
      return {};
    }
  }

  public loadTranslations(dirs: string[]) {
    dirs.forEach((dir) => {
      if (fs.existsSync(dir) && fs.lstatSync(dir).isDirectory()) {
        const files = fs.readdirSync(dir);
        files.forEach((file) => {
          const filePath = path.join(dir, file);
          if (this.isTranslationFile(filePath)) {
            const locale = path.basename(file, path.extname(file));
            this.translations[locale] = {
              ...this.translations[locale],
              ...this.readTranslationFile(filePath),
            };
          }
        });
      }
    });
  }

  public setDefaultLocale(locale: string) {
    if (locale) this.defaultLocale = locale;
  }

  public getDefaultLocale() {
    return this.defaultLocale;
  }

  public setLocale(locale: string) {
    if (locale) this.locale = locale;
  }

  public getLocale() {
    return this.locale ?? this.defaultLocale;
  }

  public get(
    key: string,
    replacements: Record<string, string> = {},
    fallback?: string,
    locale?: string
  ): string {
    const targetLocale = locale ?? this.getLocale();
    const keys = key.split('.');
    let result: any = this.translations[targetLocale];

    for (const k of keys) {
      if (result && k in result) {
        result = result[k];
      } else {
        return fallback || key; 
      }
    }

    if (typeof result === 'string') {
      return this.replace(result, replacements);
    }

    return fallback || key;
  }

  public load(dirs: string[]) {
    this.loadTranslations(dirs);
  }
}
