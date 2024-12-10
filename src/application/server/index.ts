import * as http from 'http';
import * as fs from 'fs/promises';
import * as path from 'path';
import findMyWay, { HTTPMethod } from 'find-my-way';
import fg from 'fast-glob';
import { readFileSync } from 'fs';
import { match } from 'path-to-regexp';
import { ServeStatic } from '../../shared/serve-static';

export class Server {
  private server: http.Server | undefined;
  private port: number = 3000;
  private static readonly MAX_PORT: number = 65535; // Maximum port number
  private serverLink: string = 'http://localhost';
  private router = findMyWay();
  public response: any;
  public request: any;
  private notFoundData: any = {
    status: false,
    code: 'not_found',
    message: 'Not found!',
  };
  private errorHandler: Function = (
    err: any,
    req: http.IncomingMessage,
    res: http.ServerResponse
  ) => {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({ status: false, message: 'Internal Server Error' })
    );
  };
  private middlewareBeforeRequest: any = () => {
    return true;
  };
  private bootFunction: Function | undefined;
  private prefix = '';
  public requestServer: any;
  public responseServer: any;

  init(
    port: number,
    link: string = 'http://localhost',
    response: any,
    request: any,
    prefix: string = '',
    staticServerEnabled = true,
    staticServerPath = '/public'
  ) {
    this.port = port;
    this.serverLink = link.replace(/\/$/, '');
    this.response = response;
    this.request = request;
    this.prefix = prefix;

    // Route
    if (process.env.NODE_ENV === 'production') {
      this.checkRouteInProdMode();
    }

    this.server = http.createServer(async (req, res) => {
      this.requestServer = req;
      this.responseServer = req;

      if (req.method && req.url) {
        if (process.env.NODE_ENV === 'production') {
          // Url
          const originalUrl = req.url;

          let prefix = this.prefix.replace(/^[\/\\]+|[\/\\]+$/g, '');
          prefix = prefix ? `/${prefix}` : '/';

          // Server Static
          const cleanStaticPath = `/${staticServerPath.replace(
            /^\/+|\/+$/g,
            ''
          )}/`;
          if (
            req.url.startsWith(cleanStaticPath) &&
            req.url.length > cleanStaticPath.length
          ) {
            return this.staticServerRouter(
              req,
              res,
              staticServerEnabled,
              staticServerPath
            );
          }

          // Use URL to parse the query string
          const urlObj = new URL(req.url, `http://${req.headers.host}`);
          let path = urlObj.pathname.replace(/^[\/\\]+|[\/\\]+$/g, '');
          path = path ? `/${path}` : '/';

          // If the URL matches the prefix, append a trailing slash
          if (path === prefix) {
            path = `${prefix}/`;
          }

          // Set the req.url to the modified path without the query string
          req.url = path;

          // Lookup
          this.router.lookup(req, res);

          req.url = originalUrl;
          
        } else {
          return await this.checkRouteInDevMode(
            req,
            res,
            staticServerEnabled,
            staticServerPath
          );
        }
      } else {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Bad Request');
      }
    });

    return this;
  }

  public async start(): Promise<void> {
    if(process.env.NODE_ENV === 'cli') return;
      
    try {
      await this.tryStartServer(this.port);
      console.log(`Server started on: ${this.serverLink}:${this.port}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          `Failed to start server on port ${this.port}:`,
          error.message
        );
      } else {
        console.error(
          `Failed to start server on port ${this.port}:`,
          String(error)
        );
      }
      await this.findAvailablePort();
    }
  }

  public notFound(data: any) {
    this.notFoundData = data;
  }

  public boot(bootFunction: Function) {
    this.bootFunction = bootFunction;
  }

  public addRouteNotFound() {
    this.router.on(
      'GET',
      '/*',
      async (
        req: http.IncomingMessage,
        res: http.ServerResponse,
        params: { [k: string]: string | any }
      ) => {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(this.notFoundData));
      }
    );
  }

  private async checkRouteInProdMode(
  ) {
    if (process.env.NODE_ENV === 'production') {
      try {
        const jsonContent = await fs.readFile(path.join(process.cwd(), '.dist/routes.json'), 'utf-8');
        
        let controllers = JSON.parse(jsonContent);

        if (!Array.isArray(controllers)) {
          throw new Error('JSON content must be an array of controllers');
        }

        controllers = controllers.map((controller) => {
          return {
            ...controller,
            controller: controller.controller
              .replaceAll('*', '[...]')
              .replaceAll(/:([a-zA-Z0-9_]+)\?/g, '{$1}')
              .replaceAll(/:([a-zA-Z0-9_]+)/g, '[$1]'),
          };
        });

        this.addControllers(controllers);
      } catch (error) {}
    }
  }

  private async checkRouteInDevMode(
    req: any,
    res: any,
    staticServerEnabled: boolean,
    staticServerPath: string
  ) {
    // Extract and normalize the prefix
    let prefix = this.prefix.replace(/^[\/\\]+|[\/\\]+$/g, '');
    prefix = prefix ? `/${prefix}` : '/';

    // Normalize the URL and ensure it respects the prefix
    let url = req.url?.replace(/^[\/\\]+|[\/\\]+$/g, '');
    url = url ? `/${url}` : '/';

    // Static Server
    const cleanStaticPath = `/${staticServerPath.replace(
      /^[/\\]|[/\\]$/g,
      ''
    )}/`;
    if (
      staticServerEnabled &&
      req.url.startsWith(cleanStaticPath) &&
      req.url.length > cleanStaticPath.length
    ) {
      return this.staticServerRouter(
        req,
        res,
        staticServerEnabled,
        staticServerPath
      );
    }

    if (!url.startsWith(prefix)) {
      // If the URL does not match the prefix, return 404
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(this.notFoundData));
    }

    // Remove the prefix from the URL for processing
    const originalUrl = url;
    url = url.replace(new RegExp(`^${prefix}`), '') || '/';
    req.url = url;

    // Find the controller file based on the request
    const controller: any = await this.findControllerFiles(req);
    
    if (controller) {
      req.url = originalUrl;

      // Process middleware before sending the response
      await this.routeMiddlewareBeforeRequest(req, res, controller.params);

      // Execute the corresponding method in the controller
      const result = await this.executeControllerMethod(
        controller.file,
        req.method
      );

      // Send the response with the resulting data
      this.routeHandler(res, result);
    } else {
      // If no controller is found, send a 404 response
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(this.notFoundData));
    }
  }

  private staticServerRouter(
    req: any,
    res: any,
    staticServerEnabled: boolean,
    staticServerPath: string
  ) {
    if (!staticServerEnabled) {
      return false;
    }

    staticServerPath =
      '/' + staticServerPath.replace(/^[/\\]|[/\\]$/g, '') + '/';

    req.url = req.url
      .replace(new RegExp(`^${staticServerPath}`), '')
      .replace(/\//g, '\\')
      .replace(/^\\|\\$/g, '');

    return new ServeStatic([
      process.cwd() + '/storage/public',
      path.join(__dirname, '../../storage/public'),
    ]).server(req, res);
  }

  private async getSortedRoutes(pattern: string) {
    const files = await fg(pattern);

    const sortedFiles = files.sort((a, b) => {
      // Helper function to calculate route depth
      const getDepth = (path: string) => path.split('/').length;

      // Helper function to check if a route is static
      const isStatic = (path: string) =>
        !path.includes('[') && !path.includes('{');

      // Helper function to check if a route is dynamic
      const isDynamic = (path: string) =>
        path.includes('[') || path.includes('{');

      // Helper function to check if a route is a wildcard
      const isWildcard = (path: string) => path.includes('[...]');

      // Helper function to calculate the number of static segments
      const countStaticSegments = (path: string) =>
        path
          .split('/')
          .filter((segment) => !segment.includes('[') && !segment.includes('{'))
          .length;

      // Static routes come first
      const isAStatic = isStatic(a);
      const isBStatic = isStatic(b);
      if (isAStatic && !isBStatic) return -1;
      if (!isAStatic && isBStatic) return 1;

      // Dynamic routes come after static routes
      const isADynamic = isDynamic(a);
      const isBDynamic = isDynamic(b);
      if (isADynamic && !isBDynamic) return -1;
      if (!isADynamic && isBDynamic) return 1;

      // Wildcard routes come last
      const isAWildcard = isWildcard(a);
      const isBWildcard = isWildcard(b);
      if (isAWildcard && !isBWildcard) return 1;
      if (!isAWildcard && isBWildcard) return -1;

      // Prioritize by the number of static segments
      const staticSegmentsA = countStaticSegments(a);
      const staticSegmentsB = countStaticSegments(b);
      if (staticSegmentsA !== staticSegmentsB)
        return staticSegmentsB - staticSegmentsA;

      // If both are wildcard routes, prioritize longer paths to come first
      if (isAWildcard && isBWildcard) {
        const depthA = getDepth(a);
        const depthB = getDepth(b);
        if (depthA !== depthB) return depthB - depthA; // Deeper wildcard paths come first
        return b.localeCompare(a); // Alphabetical order if depth is equal
      }

      // For other routes, prioritize deeper routes first
      const depthA = getDepth(a);
      const depthB = getDepth(b);
      if (depthA !== depthB) return depthA - depthB;

      // Alphabetical order as a fallback
      return a.localeCompare(b);
    });

    return sortedFiles;
  }

  private async findControllerFiles(req: any) {
    let url = req.url?.split('?')[0].replace(/^\/+|\/+$/g, '');
    const pattern = 'app/*/controllers/**/*.ts';

    try {
      const files = await this.getSortedRoutes(pattern);

      for (const file of files) {
        let routePattern = file
          .replace(/^app\/.*\/controllers\//, '')
          .replace(/\/index\.ts$/, '')
          .replace(/\.ts$/, '')
          .replaceAll(/\[\.\.\.\]/g, '*wildcard')
          .replaceAll(/\[([^\]]+)\]/g, ':$1')
          .replaceAll(/\/\{(\w+)\}/g, '{/:$1}')
          .replace(/:([^/]+)/g, (_, param) => `:${param}`);

        routePattern = routePattern === 'index' ? '' : routePattern;

        const matchFn = match(routePattern, {
          decode: decodeURIComponent,
          end: true,
        });

        const matchResult = matchFn(url);

        if (matchResult) {
          const methods = this.extractMethodsFromController(file);

          if (methods.includes(req.method || '')) {
            return {
              file: path.join(process.cwd(), file),
              params: matchResult.params,
            };
          }
        }
      }

      return false;
    } catch (error: any) {
      console.error('Error finding files:', error.message);
      return false;
    }
  }

  private extractMethodsFromController(controllerPath: string) {
    const content = readFileSync(controllerPath, 'utf-8');

    return this.extractMethods(content);
  }

  private extractMethods(content: string): string[] {
    const methods: string[] = [];
    const methodNames = ['get', 'post', 'put', 'patch', 'delete'];

    methodNames.forEach((method) => {
      const methodPattern = new RegExp(`\\b${method}\\b\\s*\\(`, 'i');
      if (methodPattern.test(content)) {
        methods.push(method.toUpperCase());
      }
    });

    return [...new Set(methods)]; // Remove duplicates
  }

  private tryStartServer(port: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.server) {
        this.server.listen(port, () => resolve());
        this.server.on('error', (err) => reject(err));
      } else {
        reject(new Error('Server is not initialized'));
      }
    });
  }

  private async findAvailablePort(): Promise<void> {
    for (let port = this.port + 1; port <= Server.MAX_PORT; port++) {
      try {
        await this.tryStartServer(port);
        this.port = port;
        console.log(`Server started on: ${this.serverLink}:${this.port}`);
        return;
      } catch (error) {
        // Continue to the next port if the current one is occupied
      }
    }
    console.error('No available ports found');
  }

  public stop(): void {
    if (this.server) {
      this.server.close(() => {
        console.log('Server has been stopped');
      });
    } else {
      console.log('Server is not running');
    }
  }

  public async routeMiddlewareBeforeRequest(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    params: { [k: string]: string | any }
  ) {
    if (this.response) {
      this.response.init(res, req);
    }

    if (this.request) {
      await this.request.init(req, params);
    }

    this.middlewareBeforeRequest();
  }

  public setMiddlewareBeforeRequest(func: Function) {
    this.middlewareBeforeRequest = func;
  }

  public setErrorHandler(
    handler: (
      err: any,
      req: http.IncomingMessage,
      res: http.ServerResponse
    ) => void
  ) {
    this.errorHandler = handler;
  }

  private routeHandler(res: http.ServerResponse, result: any): void {
    // Boot Function
    if (this.bootFunction) {
      this.bootFunction();
    }

    // Response
    if (!res.writableEnded) {
      if (result !== undefined && typeof result === 'object') {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result));
      } else if (result !== undefined) {
        res.end(String(result));
      } else if (
        result === undefined &&
        res.getHeader('X-Framework') === 'kawkab'
      ) {
      } else {
        // Default response if no result is provided
        res.setHeader('Content-Type', 'application/json');
        res.end('');
      }
    }
  }

  public addRoute(
    method: HTTPMethod | HTTPMethod[],
    path: string,
    handler: (
      req: http.IncomingMessage,
      res: http.ServerResponse,
      params: { [k: string]: string | any }
    ) => any
  ) {
    this.router.on(
      method,
      path,
      async (
        req: http.IncomingMessage,
        res: http.ServerResponse,
        params: { [k: string]: string | any }
      ) => {
        if ('*' in params) {
          params['wildcard'] = params['*'].split('/');
          delete params['*'];
        }

        await this.routeMiddlewareBeforeRequest(req, res, params);

        // Await the handler's result
        const result = await handler(req, res, params);
        this.routeHandler(res, result);
      }
    );
  }

  public addControllers(
    controllers: {
      method: HTTPMethod | HTTPMethod[];
      path: string;
      controller: string;
    }[]
  ) {
    controllers.forEach((controller) => {
      const methods = Array.isArray(controller.method)
        ? controller.method
        : [controller.method];

      methods.forEach((method) => {
        const routePath = (
          '/' +
          this.prefix.replace(/^\/|\/$/g, '') +
          controller.path
        ).replace(/^\/+/, '/');        

        this.addRoute(method, routePath, async () => {
          return await this.executeControllerMethod(
            controller.controller,
            method
          );
        });
      });
    });
  }

  private async executeControllerMethod(
    controllerPath: string,
    method: string
  ) {
    try {
      const fullPath = path.join(controllerPath); // Construct the full path to the controller.
      const ControllerClass = (await require(fullPath)).default; // Dynamically import the controller class.
      const controllerInstance = new ControllerClass(); // Instantiate the controller.
      const methodName = method.toLowerCase(); // Convert the HTTP method to lowercase for consistency.

      // Check if the method exists on the controller.
      if (typeof controllerInstance[methodName] === 'function') {
        // Retrieve the middleware object if defined.
        const middleware = controllerInstance.middleware?.();

        // If middleware exists for the specific method, execute it.
        if (middleware && typeof middleware[methodName] === 'function') {
          middleware[methodName](); // Execute middleware for the method.
        }

        // Execute the requested controller method, passing request parameters.
        return controllerInstance[methodName](this.requestServer.params);
      } else {
        // Throw an error if the method is not defined in the controller.
        throw new Error(`Method ${method} not found in controller`);
      }
    } catch (error: any) {
      // Log and rethrow any errors that occur during execution.ب
      console.error(`Error executing controller method: ${error.message}`);
      throw error;
    }
  }

  public async routing(jsonFilePath: string): Promise<void> {
    if (process.env.NODE_ENV === 'production') {
      try {
        const jsonContent = await fs.readFile(jsonFilePath, 'utf-8');
        let controllers = JSON.parse(jsonContent);

        if (!Array.isArray(controllers)) {
          throw new Error('JSON content must be an array of controllers');
        }

        controllers = controllers.map((controller) => {
          return {
            ...controller,
            controller: controller.controller
              .replaceAll('*', '[...]')
              .replaceAll(/:([a-zA-Z0-9_]+)\?/g, '{$1}')
              .replaceAll(/:([a-zA-Z0-9_]+)/g, '[$1]'),
          };
        });

        this.addControllers(controllers);
      } catch (error) {
        console.error('Error reading or parsing JSON file:', error);
        throw error;
      }
    }
  }
}
