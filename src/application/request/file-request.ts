import { promises as fs } from 'fs';
import path from 'path';

interface MoveOptions {
    path?: string;
    name?: string | null;
    extension?: string | null;
}

interface FileDetails {
    filepath: string;
    originalFilename: string;
    mimetype: string;
}

export class FileRequest {
  private file: FileDetails;

  constructor(file: FileDetails) {
    this.file = file;
  }

  details(): FileDetails | null {
    return this.file;
  }

  detail(): FileDetails | null {
    return this.details();
  }

  async toPublic(options: MoveOptions = {}) {
    return await this.moveFile('storage/public', options);
  }

  async toPrivate(options: MoveOptions = {}) {
    return await this.moveFile('storage/private', options);
  }

  async upload() {
    return await this.moveFile('storage');
  }

  private async moveFile(uploadDir: string, options: MoveOptions = {}) {
    const file = Array.isArray(this.file) ? this.file[0] : this.file;

    const { filepath, originalFilename } = file;
        
    const fileName = options.name || path.parse(originalFilename).name;
    const fileExtension = options.extension || path.extname(originalFilename);
    const finalFileName = fileName + fileExtension;
    const destPath = path.join(process.cwd(), uploadDir, finalFileName);

    try {
      await fs.copyFile(filepath, destPath);
      return true;
    } catch (error: any) {
      return false;
    }
  }
}
