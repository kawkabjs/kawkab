import { promises as fs } from 'fs';
import path from 'path';

// Define the Folder class for managing directory operations
export class Folder {
  private basePath: string = './'; // Base path for directory operations

  public init(basePath: string = './') {
    this.basePath = basePath;
  }

  // Create a new directory, including parent directories if needed
  async create(dirName: string): Promise<boolean> {
    const dirPath = path.join(this.basePath, dirName);
    try {
      await fs.mkdir(dirPath, { recursive: true });
      return true;
    } catch (error: any) {
      // Handle errors during directory creation
      throw new Error(`Error creating directory: ${error.message}`);
    }
  }

  // Remove a directory and its contents
  async remove(dirName: string): Promise<boolean> {
    const dirPath = path.join(this.basePath, dirName);
    try {
      await fs.rm(dirPath, { recursive: true, force: true });
      return true;
    } catch (error: any) {
      // Handle errors during directory removal
      throw new Error(`Error removing directory: ${error.message}`);
    }
  }

  // List all files and directories in the specified directory
  async list(dirName: string = ''): Promise<{ name: string; isDirectory: boolean; isFile: boolean }[]> {
    const dirPath = path.join(this.basePath, dirName);
    try {
      const contents = await fs.readdir(dirPath, { withFileTypes: true });
      return contents.map(dirent => ({
        name: dirent.name,
        isDirectory: dirent.isDirectory(),
        isFile: dirent.isFile()
      }));
    } catch (error: any) {
      // Handle errors during directory listing
      throw new Error(`Error listing directory contents: ${error.message}`);
    }
  }

  // Calculate the total size of a directory and its contents
  async size(dirName: string = ''): Promise<number> {
    const dirPath = path.join(this.basePath, dirName);

    // Recursive function to calculate size
    async function getSize(itemPath: string): Promise<number> {
      const stats = await fs.stat(itemPath);
      if (stats.isFile()) {
        return stats.size;
      } else if (stats.isDirectory()) {
        const files = await fs.readdir(itemPath);
        const sizes = await Promise.all(
          files.map(file => getSize(path.join(itemPath, file)))
        );
        return sizes.reduce((acc, size) => acc + size, 0);
      }
      return 0;
    }

    try {
      return await getSize(dirPath);
    } catch (error: any) {
      // Handle errors during directory size calculation
      throw new Error(`Error calculating directory size: ${error.message}`);
    }
  }

  // Copy a directory and its contents to a new location
  async copy(sourceDirName: string, destDirName: string): Promise<boolean> {
    const sourcePath = path.join(this.basePath, sourceDirName);
    const destPath = path.join(this.basePath, destDirName);

    // Recursive function to copy directory
    async function copyDir(src: string, dest: string): Promise<void> {
      await fs.mkdir(dest, { recursive: true });
      const entries = await fs.readdir(src, { withFileTypes: true });
      for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
          await copyDir(srcPath, destPath);
        } else {
          await fs.copyFile(srcPath, destPath);
        }
      }
    }

    try {
      await copyDir(sourcePath, destPath);
      return true;
    } catch (error: any) {
      // Handle errors during directory copying
      throw new Error(`Error copying directory: ${error.message}`);
    }
  }

  // Move a directory to a new location
  async move(sourceDirName: string, destDirName: string): Promise<boolean> {
    const sourcePath = path.join(this.basePath, sourceDirName);
    const destPath = path.join(this.basePath, destDirName);
    try {
      await fs.rename(sourcePath, destPath);
      return true;
    } catch (error: any) {
      // Handle errors during directory moving
      throw new Error(`Error moving directory: ${error.message}`);
    }
  }

  // Search for files in a directory that match a search pattern
  async find(dirName: string, searchPattern: string): Promise<string[]> {
    const dirPath = path.join(this.basePath, dirName);
    const results: string[] = [];

    // Recursive function to search for files
    async function search(currentPath: string): Promise<void> {
      const entries = await fs.readdir(currentPath, { withFileTypes: true });
      for (let entry of entries) {
        const fullPath = path.join(currentPath, entry.name);
        if (entry.isDirectory()) {
          await search(fullPath);
        } else if (entry.name.includes(searchPattern)) {
          results.push(fullPath);
        }
      }
    }

    try {
      await search(dirPath);
      return results;
    } catch (error: any) {
      // Handle errors during directory search
      throw new Error(`Error searching in directory: ${error.message}`);
    }
  }

  // Check if a directory exists
  async exists(dirName: string): Promise<boolean> {
    const dirPath = path.join(this.basePath, dirName);
    try {
      const stats = await fs.stat(dirPath);
      return stats.isDirectory();
    } catch (error) {
      return false;
    }
  }
}
