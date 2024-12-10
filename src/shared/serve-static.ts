import http from 'http';
import path from 'path';
import serveStatic from 'serve-static';
import finalhandler from 'finalhandler';

export class ServeStatic {
  // Array to hold multiple serve-static middlewares, each for a different directory
  private serves: Array<(req: http.IncomingMessage, res: http.ServerResponse, next: () => void) => void> = [];

  // Constructor accepts an array of directories to serve files from
  constructor(directories: string[]) {
    directories.forEach(directory => {
      const publicPath = path.join(directory);
            
      // Add serveStatic middleware for each directory
      this.serves.push(serveStatic(publicPath, { index: false }));
    });
  }

  // Handle incoming HTTP requests by serving static files from the directories in order
  public server(req: http.IncomingMessage, res: http.ServerResponse): void {
    let index = 0;

    // Function to try serving files from each directory in the list
    const next = (err?: any) => {
      if (err || index >= this.serves.length) {
        // If an error occurs or no more directories are left, finish the request
        return finalhandler(req, res)(err);
      }

      // Try serving files from the current directory, move to the next if not found
      const serve = this.serves[index++];
      serve(req, res, next);
    };

    next(); // Start the process
  }
}
