import { Collection } from 'collect.js';
import { type AxiosResponse } from 'axios';

export class HttpResponse {
  private response: AxiosResponse;

  constructor(response: AxiosResponse) {
    this.response = response;
  }

  public body(): string {
    return this.response.data;
  }

  public data(): string {
    return this.response.data;
  }

  public json<T = any>(key: string | null = null, defaultValue: T | null = null): T | null {
    const data = this.response.data;
    if (key) {
      return data[key] !== undefined ? data[key] : defaultValue;
    }
    return data;
  }

  public object(): object {
    return this.response.data;
  }

  public collect(key: string | null = null) {
    const data = this.json(key);
    return new Collection(data);
  }

  public status(): number {
    return this.response.status;
  }

  public successful(): boolean {
    return this.response.status >= 200 && this.response.status < 300;
  }

  public redirect(): boolean {
    return this.response.status >= 300 && this.response.status < 400;
  }

  public failed(): boolean {
    return !this.successful();
  }

  public clientError(): boolean {
    return this.response.status >= 400 && this.response.status < 500;
  }

  public serverError(): boolean {
    return this.response.status >= 500 && this.response.status < 600;
  }

  public onError(callback: (response: HttpResponse) => void): this {
    if (this.failed()) {
      callback(this);
    }
    return this;
  }

  public header(header: string): string | null {
    return this.response.headers[header.toLowerCase()] || null;
  }

  public headers(): Record<string, string | string[]> {
    return this.response.headers as Record<string, string | string[]>;
  }
}