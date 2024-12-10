import * as fs from 'fs';
import * as path from 'path';

/**
 * Create a file with specified content.
 * @param filePath The path where the file should be created.
 * @param content The content to write to the file.
 * @param vars An optional array of variables to replace in the content.
 */
export function stub(
  filePath: string,
  content: string,
  vars: Array<{ var: string; value: string }> = []
): void {
  // Ensure the directory exists
  const dirPath = path.dirname(filePath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // Replace all variables
  vars.forEach((i) => {
    content = content.replaceAll(`<${i.var}>`, i.value);
  });

  // Write the content to the file
  fs.writeFileSync(filePath, content);
}
