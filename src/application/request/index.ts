import { IncomingMessage } from 'http';
import { URL } from 'url';
import * as formidable from 'formidable';
import { FileRequest } from './file-request';

export class Request {
  private static req: IncomingMessage | undefined;
  private static variables: { [key: string]: string | string[] } = {};
  private static paramsList: any = {};
  private static bodyList: any = {};
  private static fileList: any = {};

  public static async init(req: IncomingMessage, vars: { [key: string]: string | string[] }) {
    this.req = req;
    this.variables = vars;

    this.paramsList = this.params();
    this.bodyList = await this.parseBody();

    return this;
  }

  // Headers and Metadata
  public static headers(): { [key: string]: string } {
    if (!this.req) {
      throw new Error('Request is undefined');
    }
    return this.req.headers as { [key: string]: string };
  }

  public static header(name: string, defaultValue: string = ''): string {
    const headers = this.headers();
    return headers[name.toLowerCase()] || defaultValue;
  }

  public static bearerToken(): string | null {
    const authHeader = this.header('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    return null;
  }

  // IP Address
  public static ip(): string | null {
    return this.header('x-forwarded-for') || this.header('remote-address') || null;
  }

  public static ips(): string[] {
    const forwardedFor = this.header('x-forwarded-for');
    return forwardedFor ? forwardedFor.split(',').map(ip => ip.trim()) : [];
  }

  // Content Negotiation
  public static getAcceptableContentTypes(): string[] {
    const acceptHeader = this.header('accept');
    return acceptHeader ? acceptHeader.split(',').map(type => type.trim()) : [];
  }

  public static accepts(types: string[]): string | false {
    const acceptableTypes = this.getAcceptableContentTypes();
    for (const type of types) {
      if (acceptableTypes.includes(type)) {
        return type;
      }
    }
    return false;
  }

  public static expectsJson(): boolean {
    return this.accepts(['application/json']) === 'application/json';
  }

  public static wantsJson(): boolean {
    return this.expectsJson();
  }

  // Request Body
  private static async parseBody(): Promise<any> {
    if (!this.req) {
      return {};
    }

    const contentType = this.header('content-type');

    try {
      // For JSON requests
      if (contentType && contentType.includes('application/json')) {
        return await new Promise((resolve) => {
          let body = '';
                    this.req!.on('data', chunk => {
                      body += chunk.toString();
                    });
                    this.req!.on('end', () => {
                      try {
                        resolve(JSON.parse(body));
                      } catch {
                        resolve({});
                      }
                    });
        });
      }

      // For form-urlencoded requests
      if (contentType && contentType.includes('application/x-www-form-urlencoded')) {
        return await new Promise((resolve) => {
          let body = '';
                    this.req!.on('data', chunk => {
                      body += chunk.toString();
                    });
                    this.req!.on('end', () => {
                      const params = new URLSearchParams(body);
                      const result: { [key: string]: any } = {};
                      for (const [key, value] of params) {
                        result[key] = value;
                      }
                      resolve(result);
                    });
        });
      }

      // For multipart/form-data requests
      if (contentType && contentType.includes('multipart/form-data')) {
        return await new Promise((resolve) => {
          const form = new formidable.IncomingForm({ multiples: true });

          form.parse(this.req!, (err, fields, files) => {
            if (err) {
              resolve({});
              return;
            }

            // Merge fields and files into a single object
            const result: { [key: string]: any } = {};

            // Process fields
            for (const key in fields) {
              if (key.endsWith('[]')) {
                result[key.slice(0, -2)] = Array.isArray(fields[key]) ? fields[key] : [fields[key]];
              } else {
                result[key] = Array.isArray(fields[key]) ? fields[key][0] : fields[key];
              }
            }

            // Process files
            for (const key in files) {
              if (key.endsWith('[]')) {
                result[key.slice(0, -2)] = Array.isArray(files[key]) ? files[key] : [files[key]];
              } else {
                result[key] = Array.isArray(files[key]) ? files[key][0] : files[key];
              }
            }

            // Update fileList with the files
            this.fileList = files;

            resolve(result);
          });
        });
      }
    } catch {
      return {};
    }

    // If content type is not recognized, return an empty object
    return {};
  }

  public static async only(...keys: string[]): Promise<{ [key: string]: any }> {
    const result: { [key: string]: any } = {};
    keys.forEach(key => {
      if (key in this.bodyList) {
        result[key] = this.bodyList[key];
      }
    });
    return result;
  }

  public static async has(keys: string | string[]): Promise<boolean> {
    if (Array.isArray(keys)) {
      return keys.some(key => key in this.bodyList);
    }
    return keys in this.bodyList;
  }

  public static async hasAny(keys: string[]): Promise<boolean> {
    return this.has(keys);
  }

  public static async whenHas(key: string, callback: (input: any) => void, fallback?: () => void): Promise<void> {
    if (key in this.bodyList) {
      callback(this.bodyList[key]);
    } else if (fallback) {
      fallback();
    }
  }

  public static async anyFilled(keys: string[]): Promise<boolean> {
    return keys.some(key => this.bodyList[key] != null && this.bodyList[key] !== '');
  }

  public static async whenFilled(key: string, callback: (input: any) => void, fallback?: () => void): Promise<void> {
    if (this.bodyList[key] != null && this.bodyList[key] !== '') {
      callback(this.bodyList[key]);
    } else if (fallback) {
      fallback();
    }
  }

  public static async filled(key: string): Promise<boolean> {
    return this.bodyList[key] != null && this.bodyList[key] !== '';
  }

  public static async whenMissing(key: string, callback: () => void, fallback?: () => void): Promise<void> {
    if (!(key in this.bodyList)) {
      callback();
    } else if (fallback) {
      fallback();
    }
  }

  public static async missing(key: string): Promise<boolean> {
    return !(key in this.bodyList);
  }

  public static async mergeIfMissing(data: { [key: string]: any }): Promise<void> {
    for (const key in data) {
      if (!(key in this.bodyList)) {
        this.bodyList[key] = data[key];
      }
    }
  }

  public static async except(...keys: string[]): Promise<{ [key: string]: any }> {
    const result: { [key: string]: any } = {};
    for (const key in this.bodyList) {
      if (!keys.includes(key)) {
        result[key] = this.bodyList[key];
      }
    }
    return result;
  }

  public static input(key: string, defaultValue: any = null): any {
    return this.bodyList[key] !== undefined ? this.bodyList[key] : defaultValue;
  }

  public static inputs(): Promise<{ [key: string]: any }> {
    return {
      ...this.paramsList,
      ...this.bodyList
    };
  }

  // URL and Routing
  public static url(): string {
    if (!this.req || !this.req.url) {
      throw new Error('Request URL is undefined');
    }
    
    const url = new URL(this.req.url, `http://${this.header('host')}`);
    return `${url.origin}${url.pathname}`;
  }

  public static fullUrl(): string {
    if (!this.req || !this.req.url) {
      throw new Error('Request URL is undefined');
    }

    return new URL(this.req.url, `http://${this.header('host')}`).toString();
  }

  public static method(): string {
    return this.req?.method || '';
  }

  public static referrer(): string {
    return this.header('referer') || '';
  }

  public static querystring() {
    if (!this.req || !this.req.url) {
      throw new Error('Request URL is undefined');
    }
        
    return new URL(this.fullUrl()).search;
  }

  public static params() {
    if (!this.req || !this.req.url) {
      throw new Error('Request URL is undefined');
    }
    
    const url = new URL(new URL(this.req.url, `http://${this.header('host')}`).toString());

    const paramsArray: { key: string, value: string }[] = [];
    
    url.searchParams.forEach((value, key) => {
      paramsArray.push({ key, value });
    });
    
    return paramsArray;
  }

  public static param(key: string, defaultValue: any = null): any {
    if (!this.req || !this.req.url) {
      throw new Error('Request URL is undefined');
    }
    
    const url = new URL(this.fullUrl());
    const queryParams = url.searchParams;
    const value = queryParams.get(key);
    
    return value !== null ? value : defaultValue;
  }

  // Protocol and Host
  public static protocol(): string {
    return this.header('x-forwarded-proto') || 'http';
  }

  public static href(): string {
    return this.fullUrl();
  }

  public static origin(): string {
    return new URL(this.href()).origin;
  }

  public static host(): string {
    return this.header('host') || '';
  }

  public static hostname(): string {
    return new URL(this.href()).hostname;
  }

  public static vars(): { [key: string]: string | string[] } {
    return this.variables;
  }

  public static var(key: string, defaultValue: any = null): any {
    return this.variables[key] || defaultValue;
  }
    
  // File Uploads
  public static file(name: string): FileRequest | null {
    // Check if the request object is defined
    if (!this.req) {
      throw new Error('Request object is undefined');
    }
    
    // Get the file from the file list, or null if not found
    const file = this.fileList[name] !== undefined ? this.fileList[name] : null;
        
    // If the file exists in the list
    if (file) {
      console.log('return new file');
    
      // If the file is an array, return only the first element as a FileRequest
      if (Array.isArray(file)) {
        return new FileRequest(file[0]);  // Return the first file only
      }
    
      // If it's a single file, return it directly as a FileRequest
      return new FileRequest(file);
    }
    
    // If no file is found, return null
    return null;
  }
    
  public static files(name: string): FileRequest[] | null {
    // Check if the request object is defined
    if (!this.req) {
      throw new Error('Request object is undefined');
    }
    
    // Get the file from the file list, or null if not found
    const file = this.fileList[name] !== undefined ? this.fileList[name] : null;
        
    // If the file exists in the list
    if (file) {
      console.log('return new files');
    
      // If the file is an array, return all elements as FileRequest objects
      if (Array.isArray(file)) {
        return file.map(f => new FileRequest(f));  // Map all files to FileRequest
      }
    
      // If it's a single file, return it as an array with one FileRequest
      return [new FileRequest(file)];
    }
    
    // If no files are found, return null
    return null;
  }
}