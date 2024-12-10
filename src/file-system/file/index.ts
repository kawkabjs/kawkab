import { promises as fs } from 'fs';
import path from 'path';

// Define the structure for file statistics
interface FileStats {
    size: number;        // File size in bytes
    created: Date;       // File creation date
    modified: Date;      // Last modified date
    isDirectory: boolean; // True if it's a directory, false otherwise
}

export class File {
  private basePath: string = './'; // Base path for file operations

  public init(basePath: string = './') {
    this.basePath = basePath;
  }

  // Read the content of a file
  async read(fileName: string) {
    const filePath = path.join(this.basePath, fileName);
    try {
      const content = await fs.readFile(filePath, 'utf8');
      return content;
    } catch (error: any) {
      throw new Error(`Error reading file: ${error.message}`);
    }
  }

  // Write content to a file, overwriting if it exists
  async write(fileName: string, content: string) {
    const filePath = path.join(this.basePath, fileName);
    try {
      await fs.writeFile(filePath, content, 'utf8');
      return true;
    } catch (error: any) {
      throw new Error(`Error writing file: ${error.message}`);
    }
  }

  // Append content to a file
  async append(fileName: string, content: string) {
    const filePath = path.join(this.basePath, fileName);
    try {
      await fs.appendFile(filePath, content, 'utf8');
      return true;
    } catch (error: any) {
      throw new Error(`Error appending to file: ${error.message}`);
    }
  }

  // Delete a file
  async delete(fileName: string) {
    const filePath = path.join(this.basePath, fileName);
    try {
      await fs.unlink(filePath);
      return true;
    } catch (error: any) {
      throw new Error(`Error deleting file: ${error.message}`);
    }
  }

  // List all files in the base directory with detailed information
  async list(folderPath: string = '') {
    try {
      const folder = path.join(this.basePath, folderPath);
      const files = await fs.readdir(folder);
            
      const fileDetails = await Promise.all(
        files.map(async (fileName) => {
          const filePath = path.join(folder, fileName);
          const stats = await fs.stat(filePath);
                    
          return {
            name: fileName,
            stats: {
              size: stats.size,
              created: stats.birthtime,
              modified: stats.mtime,
              isDirectory: stats.isDirectory()
            }
          };
        })
      );
            
      return fileDetails;
    } catch (error: any) {
      throw new Error(`Error listing files: ${error.message}`);
    }
  }

  // Copy a file from source to destination
  async copy(sourceFileName: string, destFileName: string) {
    const sourcePath = path.join(this.basePath, sourceFileName);
    const destPath = path.join(this.basePath, destFileName);
    try {
      await fs.copyFile(sourcePath, destPath);
      return true;
    } catch (error: any) {
      throw new Error(`Error copying file: ${error.message}`);
    }
  }

  // Move a file from source to destination
  async move(sourceFileName: string, destFileName: string) {
    const sourcePath = path.join(this.basePath, sourceFileName);
    const destPath = path.join(this.basePath, destFileName);
    try {
      await fs.rename(sourcePath, destPath);
      return true;
    } catch (error: any) {
      throw new Error(`Error moving file: ${error.message}`);
    }
  }

  // Get statistics of a file
  async stats(fileName: string) {
    const filePath = path.join(this.basePath, fileName);
    try {
      const stats = await fs.stat(filePath);
      return {
        size: stats.size,         // File size in bytes
        created: stats.birthtime, // File creation date
        modified: stats.mtime,    // Last modified date
        isDirectory: stats.isDirectory(), // True if it's a directory
      };
    } catch (error: any) {
      throw new Error(`Error getting file stats: ${error.message}`);
    }
  }

  // Check if a file exists
  async exists(fileName: string) {
    const filePath = path.join(this.basePath, fileName);
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}
