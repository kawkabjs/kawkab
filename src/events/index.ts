import * as path from 'path';
import * as fs from 'fs';

export class Event {
  private dirs: string[] = [];
  private fileCache: { [key: string]: string[] } = {};

  public load(dirs: string[]) {
    this.dirs.push(...dirs);
  }

  public async emit(event: string, data: any={}) {
    const files = this.fileCache[event] || (await this.loadEventFiles(event));

    await Promise.all(
      files.map(async (file) => {
        try {
          const eventHandler = require(file).default;
          if (typeof eventHandler === 'function') {
            eventHandler(data);
          }
        } catch (error) {}
      })
    );
  }

  private async loadEventFiles(event: string): Promise<string[]> {
    const eventFiles: string[] = [];

    for (const dir of this.dirs) {
      const eventDir = path.join(dir, event);
      try {
        if (fs.existsSync(eventDir)) {
          const filesInDir = fs.readdirSync(eventDir);

          const filteredFiles = filesInDir
            .filter((file) => file.endsWith('.ts') || file.endsWith('.js'))
            .map((file) => path.join(eventDir, file));

          eventFiles.push(...filteredFiles);
        }
      } catch (error) {}
    }

    this.fileCache[event] = eventFiles;
    return eventFiles;
  }
}
