import { ServerResponse, IncomingMessage } from 'http';
import { ServeStatic } from '../../shared/serve-static';
import { Res } from './res';
import { __ThrowHttpResponse } from '../../exceptions/errors/__throw-http-response';

export class Response extends Res {
  private static res: ServerResponse | undefined;
  private static req: IncomingMessage | undefined;
  private static isSent: boolean = false; // Variable to track if the response has been sent

  public static init(res: ServerResponse, req: IncomingMessage) {
    if (this.isCli()) {
      return this; // Return `this` to continue without doing anything in CLI
    }

    res.setHeader('X-Framework', 'kawkab');

    this.res = res;
    this.req = req;
    this.isSent = false; // Reset the sent state when initializing

    return this;
  }

  private static isCli(): boolean {
    // Check if the environment is CLI by detecting the absence of ServerResponse and IncomingMessage
    return process.env.NODE_ENV === 'cli';
  }

  private static file(
    directory: string = '/storage/public',
    filePath: string
  ): void {
    if (this.isCli()) {
      return; // Do nothing if in CLI
    }

    const req = this.req;
    const res = this.res;

    if (!req || !res) {
      return; // Skip if no request/response in CLI
    }

    req.url = filePath.replace(/^\/|\/$/g, '');

    new ServeStatic([process.cwd() + directory]).server(req, res);
  }

  public static header(name: string, value: string) {
    if (this.isCli()) {
      return this; // Return `this` to continue without setting header in CLI
    }

    if (this.res) {
      if (!this.isSent) {
        // Check if the response has already been sent
        this.res.setHeader(name, value);
      }
    }

    return this;
  }

  public static status(statusCode: number) {
    if (this.isCli()) {
      return this; // Return `this` to continue without setting status in CLI
    }

    if (this.res) {
      if (!this.isSent) {
        // Check if the response has already been sent
        this.res.statusCode = statusCode;
      }
    }

    return this;
  }

  public static string(text: string, statusCode: number = 200): void {
    if (this.isCli()) {
      return; // Do nothing if in CLI
    }

    this.status(statusCode).header('Content-Type', 'text/plain');
    if (this.res) {
      if (!this.isSent) {
        this.isSent = true; // Mark the response as sent
        this.res.end(text);
      }
    }
  }

  public static html(html: string, statusCode: number = 200): void {
    if (this.isCli()) {
      return; // Do nothing if in CLI
    }

    this.status(statusCode).header('Content-Type', 'text/html');
    if (this.res) {
      if (!this.isSent) {
        this.isSent = true; // Mark the response as sent
        this.res.end(html);
      }
    }
  }

  public static json(json: any, statusCode: number = 200): void {
    if (this.isCli()) {
      return; // Do nothing if in CLI
    }

    this.status(statusCode).header('Content-Type', 'application/json');
    if (this.res) {
      if (!this.isSent) {
        this.isSent = true; // Mark the response as sent
        this.res.end(JSON.stringify(json));
      }
    }
  }

  public static xml(xml: string, statusCode: number = 200): void {
    if (this.isCli()) {
      return; // Do nothing if in CLI
    }

    this.status(statusCode).header('Content-Type', 'application/xml');
    if (this.res) {
      if (!this.isSent) {
        this.isSent = true; // Mark the response as sent
        this.res.end(xml);
      }
    }
  }

  public static publicFile(filePath: string): void {
    if (this.isCli()) {
      return; // Do nothing if in CLI
    }

    this.file('/storage/public', filePath);
  }

  public static privateFile(filePath: string): void {
    if (this.isCli()) {
      return; // Do nothing if in CLI
    }

    this.file('/storage/private', filePath);
  }

  public static throwJson(json: any, statusCode: number = 200): void {
    if (this.isCli()) {
      return; // Do nothing if in CLI
    }

    throw new __ThrowHttpResponse(
      JSON.stringify({
        data: json,
        code: statusCode,
        method: 'json',
      })
    );
  }

  public static throwResponse(res: __ThrowHttpResponse) {
    if (this.isCli()) {
      return; // Do nothing if in CLI
    }

    const message = JSON.parse(res.message);

    if (message.method === 'json') {
      this.json(message.data, message.code);
    } else if (message.method === 'html') {
      this.html(message.data, message.code);
    } else if (message.method === 'string') {
      this.string(message.data, message.code);
    } else if (message.method === 'xml') {
      this.xml(message.data, message.code);
    }
  }
}
